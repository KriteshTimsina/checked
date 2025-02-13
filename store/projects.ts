import { IProject, projects as projectSchema } from '@/db/schema';
import { getDb } from '@/utils/db';
import { toast } from '@/utils/toast';
import { eq } from 'drizzle-orm';
import { create } from 'zustand';

interface ProjectState {
  projects: IProject[];
  getAllProjects: () => void;
  deleteProject: (id: number) => Promise<boolean>;
  //   updateProject: (id: number, data: Partial<IProject>) => void;
  createProject: (data: Partial<IProject>) => Promise<boolean>;
}

const db = getDb();

export const useProjectStore = create<ProjectState>()(set => ({
  projects: [],
  getAllProjects: async () => {
    try {
      const projects = await db.query.projects.findMany();
      if (projects.length === 0) {
        return toast('No projects. Add one to view.');
      }
      set({ projects });
    } catch (error) {
      console.log(error, 'Failed retrieving projects. ');
      return toast('Failed retrieving projects.');
    }
  },
  createProject: async (data: Partial<IProject>) => {
    const [newProject] = await db
      .insert(projectSchema)
      .values({
        title: data.title!,
        description: data.description,
        createdAt: data.createdAt,
      })
      .returning({
        id: projectSchema.id,
        title: projectSchema.title,
        description: projectSchema.description,
        createdAt: projectSchema.createdAt,
      });

    if (newProject) {
      set(state => ({
        projects: [...state.projects, newProject],
      }));

      return true;
    }
    return false;
  },
  deleteProject: async (id: number) => {
    const deleted = await db.delete(projectSchema).where(eq(projectSchema.id, id));

    if (deleted.changes === 1) {
      set(state => ({
        projects: state.projects.filter(project => project.id !== id),
      }));
      return true;
    }

    return false;
  },
}));

export const useProject = () => {
  const projects = useProjectStore(state => state.projects);
  const getAllProjects = useProjectStore(state => state.getAllProjects);
  const createProject = useProjectStore(state => state.createProject);
  const deleteProject = useProjectStore(state => state.deleteProject);

  return {
    projects,
    getAllProjects,
    createProject,
    deleteProject,
  };
};
