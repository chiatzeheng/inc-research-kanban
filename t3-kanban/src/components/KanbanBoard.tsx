// components/KanbanBoard.tsx
interface KanbanBoardProps {
  children: React.ReactNode;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ children }) => {
  return <main className="bg-slate-50 py-10">{children}</main>;
};

export default KanbanBoard;
