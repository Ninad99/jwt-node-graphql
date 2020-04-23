import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String)
	@Column('text')
	name: string;

	@Field(() => String)
	@Column('text')
	email: string;

	@Column('text')
	password: string;
}
