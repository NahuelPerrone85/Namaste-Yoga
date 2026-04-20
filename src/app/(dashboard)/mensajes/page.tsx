import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ChatClient from '@/components/chat/ChatClient';

export default async function MensajesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id as string;
  const role = (session.user as { role?: string }).role;

  // Obtener conversaciones del usuario
  const conversations = await db.conversation.findMany({
    where: {
      participants: { some: { userId } },
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, image: true, role: true },
          },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Si es admin, obtener lista de usuarios para iniciar conversaciones
  let users: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  }[] = [];
  if (role === 'ADMIN') {
    users = await db.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, name: true, image: true, role: true },
      orderBy: { name: 'asc' },
    });
  } else {
    // Alumnos solo pueden hablar con admins e instructores
    users = await db.user.findMany({
      where: {
        id: { not: userId },
        role: { in: ['ADMIN', 'INSTRUCTOR'] },
      },
      select: { id: true, name: true, image: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFAF5' }}>
      <div
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}
      >
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}
          >
            Mensajes 💬
          </h1>
          <p style={{ fontSize: '15px', color: '#9E8E82' }}>
            Chat privado con instructores y alumnos
          </p>
        </div>
        <ChatClient
          conversations={conversations}
          currentUserId={userId}
          users={users}
        />
      </div>
    </div>
  );
}
