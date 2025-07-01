// prisma/seed.ts
import { PrismaClient, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Limpando banco de dados...');
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Criando usuário...');
  const passwordHash = await bcrypt.hash('teste123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      passwordHash,
    },
  });

  console.log('📁 Criando projeto...');
  const project = await prisma.project.create({
    data: {
      title: 'Projeto Teste',
      description: 'Projeto criado via Teste',
      userId: user.id,
    },
  });

  console.log('✅ Criando tarefas...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Tarefa 1',
        status: Status.TODO,
        dueDate: new Date('2025-07-02'),
        projectId: project.id,
      },
      {
        title: 'Tarefa 2',
        status: Status.DOING,
        dueDate: new Date('2025-07-05'),
        projectId: project.id,
      },
    ],
  });

  console.log('🌱 Teste finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
