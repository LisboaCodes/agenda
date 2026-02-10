import { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import api from '../services/api';
import { Note } from '../types';
import { Plus, Pin, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Erro ao carregar anotações');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, { title, content, category });
        toast.success('Anotação atualizada!');
      } else {
        await api.post('/notes', { title, content, category });
        toast.success('Anotação criada!');
      }
      resetForm();
      loadNotes();
    } catch (error) {
      toast.error('Erro ao salvar anotação');
    }
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content || '');
    setCategory(note.category || '');
    setEditingId(note.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta anotação?')) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Anotação excluída!');
      loadNotes();
    } catch (error) {
      toast.error('Erro ao excluir anotação');
    }
  };

  const handlePin = async (id: string) => {
    try {
      await api.patch(`/notes/${id}/pin`);
      loadNotes();
    } catch (error) {
      toast.error('Erro ao fixar anotação');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Anotações</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Anotação
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input min-h-[150px]"
              />
            </div>
            <Input
              label="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Atualizar' : 'Criar'}</Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className="relative">
            {note.isPinned && (
              <Pin className="absolute top-4 right-4 w-4 h-4 text-primary-600" />
            )}
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            {note.content && (
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            )}
            {note.category && (
              <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded mb-4">
                {note.category}
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handlePin(note.id)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Pin className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(note)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="p-2 hover:bg-gray-100 rounded text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {notes.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma anotação encontrada</p>
        </div>
      )}
    </div>
  );
};
