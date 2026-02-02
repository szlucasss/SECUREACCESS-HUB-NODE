import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // Índice para buscas rápidas por ID do Keycloak (login)
  @Column({ unique: true })
  keycloakId: string;

  @Index() // Índice para buscas rápidas por email (login/cadastro)
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
