"use client";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id?: number;
    name?: string;
    email?: string;
  } | null;
  onLogout: () => void;
}

export default function UserModal({
  isOpen,
  onClose,
  user,
  onLogout,
}: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Meu Perfil</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h4 className="text-lg font-medium text-gray-800">
              {user?.name || "Usuário"}
            </h4>
            <p className="text-sm text-gray-500">{user?.email || ""}</p>
          </div>

          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Configurações
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
