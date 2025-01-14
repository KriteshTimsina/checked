import { IProject } from '@/db/schema';
import { getDb } from '@/utils/db';
import { toast } from '@/utils/toast';
import { create } from 'zustand';

interface ProjectState {
  projects: IProject[];
  getAllProjects: () => void;
  //   deleteProject: (id: number) => void;
  //   updateProject: (id: number, data: Partial<IProject>) => void;
  //   createProject: (data: Partial<IProject>) => void;
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
      return toast('Failed retrieving projects. ');
    }
  },
}));

export const useProject = () => {
  const projects = useProjectStore(state => state.projects);
  const getAllProjects = useProjectStore(state => state.getAllProjects);

  return {
    projects,
    getAllProjects,
  };
};
