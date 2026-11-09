import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersService } from './users.service.js';

describe('UsersService (додаткове завдання: модульні тести з Test.createTestingModule)', () => {
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('findAll: повертає 3 початкових користувачів як незалежні копії', () => {
    const users = service.findAll();
    expect(users).toHaveLength(3);
    expect(users[0]).toMatchObject({ id: 1, role: 'student' });

    users[0]!.fullName = 'Змінене Ім’я';
    expect(service.findOne(1).fullName).toBe('Петренко Андрій Іванович');
  });

  it('find: повертає користувача за існуючим id (2) та undefined для неіснуючого (99)', () => {
    expect(service.find(2)).toMatchObject({ id: 2, role: 'teacher' });
    expect(service.find(99)).toBeUndefined();
  });

  it('findOne: повертає адміністратора з id = 3', () => {
    const admin = service.findOne(3);
    expect(admin).toEqual({
      id: 3,
      fullName: 'Шевчук Олег Петрович',
      email: 'o.shevchuk@college.example.ua',
      role: 'admin',
    });
  });

  it('findOne: кидає NotFoundException для неіснуючого користувача', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });
});
