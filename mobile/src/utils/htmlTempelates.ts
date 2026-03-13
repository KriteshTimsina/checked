import { IEntry, INote } from '@/db/schema';

export const generateChecklistHTML = (title: string, entries: IEntry[]) => {
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>Top Priorities</title>
    <!-- Adding Font Awesome for the icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        a{
        text-decoration: none;
        color: black;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: white;
            min-height: 100vh;
        }

        .todo-card {
            background: white;
            width: 100%;
            height: 100vh;
        }

        .header {
            background-color: #e0c59e;
            padding: 20px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .footer{
            position: fixed;
            bottom: 0;
            left:0;
            right:0;
            width:100%;
            background-color: #e0c59e;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .todo-list {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }

        .todo-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }

        .todo-item input[type="checkbox"] {
            margin-right: 15px;
            width: 20px;
            height: 20px;
            border: 2px solid #e0c59e;
            cursor: pointer;
        }

        .todo-text {
            font-size: 16px;
            color: #333;
            flex-grow: 1;
            line-height: 1.5;
        }

        .github-button{
            background-color:white;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            
        }

        /* Custom checkbox styling */
        input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #e0c59e;
            border-radius: 3px;
            outline: none;
            cursor: pointer;
            position: relative;
        }

        input[type="checkbox"]:checked {
            background-color: #e0c59e;
        }

        input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            color: white;
            font-size: 14px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }


    </style>
</head>
<body>
    <div class="todo-card">
        <div class="header">
            <div class="header-left">
            ${title}
            </div>
           <a href="https://github.com/kriteshtimsina/checked" target="_blank" rel="noopener noreferrer" class="github-button"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>Star on GitHub</a>
        </div>
        <div class="todo-list">
        ${entries.map(entry => {
          return `<div key=${entry.id} class="todo-item">
                <input type="checkbox" ${entry.completed ? 'checked' : ''}>
                <div class="todo-text">${entry.title}</div>
            </div>
            `;
        })}
        </div>

        <div class="footer">
              <p>Created with 💖 <a href="https://kriteshtimsina.com.np">Kritesh Timsina</a></p>
              <p>Checked ✅</p>
        </div>
    </div>
</body>
</html>
`;
};

export const generateNoteHTML = (note: INote) => {
  const createdAt = new Date(note.createdAt).toLocaleString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>${note.title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        a {
            text-decoration: none;
            color: black;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }


        .note-card {
            background: white;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .header {
            background-color: #e0c59e;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
         .footer{
            position: fixed;
            bottom: 0;
            left:0;
            right:0;
            width:100%;
            background-color: #e0c59e;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .note-content {
            padding: 30px;
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
            flex-grow: 1;
        }

        .note-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }

        .note-description {
            font-size: 18px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
            white-space: pre-wrap;
        }

        .note-date {
            font-size: 14px;
            color: #888;
            font-style: italic;
        }

        .github-button {
            background-color: white;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="note-card">
        <div class="header">
            <div class="note-title">${note.title}</div>
            <a href="https://github.com/kriteshtimsina/checked" target="_blank" rel="noopener noreferrer" class="github-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                Star on GitHub
            </a>
        </div>
        <div class="note-content">
            
            <div class="note-description">${note.content}</div>
            <div class="note-date">Created on: ${createdAt}</div>
        </div>
        <div class="footer">
            <p>Created with 💖 <a href="https://kriteshtimsina.com.np">Kritesh Timsina</a></p>
            <p>Checked ✅</p>
        </div>
    </div>
</body>
</html>
`;
};
