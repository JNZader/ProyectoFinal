import { useState, useEffect } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { useClientesDirecciones } from '@/hooks/useClientesDirecciones';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/supabase/config';
import { Cliente } from '@/services/cliente';

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
}

export default function Clientes() {
  const { 
    clientes, 
    isLoading, 
    createCliente, 
    updateCliente, 
    deleteCliente,
    isCreating,
    isUpdating,
    isDeleting 
  } = useClientes();
  
  const { clientesDirecciones } = useClientesDirecciones();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<Cliente | null>(null);
  const [form, setForm] = useState<FormState>({ nombre: '', email: '', telefono: '' });
  const [adminUserId, setAdminUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAdminUserId = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('usuario_id')
          .eq('clerk_user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching admin user ID:', error);
          return;
        }
        setAdminUserId(data?.usuario_id || null);
      }
    };
    fetchAdminUserId();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create usuario
      const { data: newUsuario, error: userError } = await supabase
        .from('usuarios')
        .insert([{
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          rol: 'CLIENTE',
          activo: true,
          provedor_auth: 'manual',
          clerk_user_id: `manual_${Date.now()}`,
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Create cliente
      await createCliente({
        usuario_id: newUsuario.usuario_id,
        fecha_registro: new Date().toISOString(),
        acepta_email: true,
        acepta_sms: true,
        puntos_acumulados: 0,
      });

      setForm({ nombre: '', email: '', telefono: '' });
      setOpen(false);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCliente) return;
    
    try {
      // Update usuario
      await supabase
        .from('usuarios')
        .update({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
        })
        .eq('usuario_id', editCliente.usuario_id);

      // Update cliente
      await updateCliente({
        id: editCliente.cliente_id,
        updates: {
          acepta_email: true,
          acepta_sms: true,
        }
      });

      setForm({ nombre: '', email: '', telefono: '' });
      setEditOpen(false);
      setEditCliente(null);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async (clienteId: number) => {
    if (!adminUserId) return;
    try {
      await deleteCliente({ 
        id: clienteId, 
        deleted_by: adminUserId 
      });
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const getDireccionPrincipal = (clienteId: number): string => {
    const relacion = clientesDirecciones.find(
      (cd) => cd.cliente_id === clienteId && cd.principal
    );
    
    return relacion
      ? `${relacion.direccion?.tipo} ${relacion.direccion?.calle} ${relacion.direccion?.numero}, ${relacion.direccion?.localidad?.nombre}`
      : 'Sin dirección';
  };

  if (isLoading) return <div className="text-center mt-8">Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>
      
      {/* Add Client Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Añadir Cliente</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Client Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Actualizando...' : 'Guardar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Clients Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Puntos Acumulados</TableHead>
            <TableHead>Dirección Principal</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.cliente_id}>
              <TableCell>{cliente.usuarios?.nombre}</TableCell>
              <TableCell>{cliente.usuarios?.email}</TableCell>
              <TableCell>{cliente.usuarios?.telefono || 'No especificado'}</TableCell>
              <TableCell>{cliente.puntos_acumulados}</TableCell>
              <TableCell>{getDireccionPrincipal(cliente.cliente_id)}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditCliente(cliente);
                    setForm({
                      nombre: cliente.usuarios?.nombre || '',
                      email: cliente.usuarios?.email || '',
                      telefono: cliente.usuarios?.telefono || '',
                    });
                    setEditOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(cliente.cliente_id)}
                  disabled={!adminUserId || isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}