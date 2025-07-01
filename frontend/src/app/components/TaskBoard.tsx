'use client';

import { useEffect, useState } from 'react';
import api from '../lib/axios';
import TaskForm from './forms/TaskForm';

interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'DOING' | 'DONE';
  dueDate: string;
  projectId: number;
}

interface Props {
  projectId: number;
}

export default function TaskBoard({ projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/${projectId}`);
        setTasks(res.data);
      } catch (err) {
        console.error('Erro ao buscar tarefas', err);
      }
    };

    fetchTasks();
  }, [projectId, reload]);

  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Erro ao atualizar status', err);
    }
  };

  const columns = [
    { 
      label: 'A Fazer', 
      status: 'TODO',
      bgColor: 'bg-red-505',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700'
    },
    { 
      label: 'Fazendo', 
      status: 'DOING',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    { 
      label: 'Feito', 
      status: 'DONE',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  return (
    <div className="space-y-6">
    
      <TaskForm projectId={projectId} onCreated={() => setReload(!reload)} />

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ label, status, bgColor, borderColor, textColor }) => (
          <div 
            key={status} 
            className={`p-4 rounded-xl border ${bgColor} ${borderColor}`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{label}</h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-800">{task.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Vence: {formatDate(task.dueDate)}
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      {status !== 'TODO' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'TODO')}
                          className="text-xs px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          ← Voltar
                        </button>
                      )}
                      {status !== 'DONE' && (
                        <button
                          onClick={() =>
                            updateTaskStatus(
                              task.id,
                              status === 'TODO' ? 'DOING' : 'DONE'
                            )
                          }
                          className="text-xs px-3 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          {status === 'TODO' ? 'Fazendo →' : 'Feito →'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              {tasks.filter((task) => task.status === status).length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  Nenhuma tarefa nesta coluna
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
