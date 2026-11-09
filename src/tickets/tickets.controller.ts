import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import type { Ticket, TicketStatus } from './ticket.model.js';
import { type CreateTicketInput, TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async findAll(
    @Query('status') status?: TicketStatus,
    @Query('authorId') authorId?: string,
  ): Promise<Ticket[]> {
    const parsedAuthorId =
      authorId !== undefined && authorId.trim() !== ''
        ? Number(authorId)
        : undefined;
    return this.ticketsService.findAll({
      ...(status !== undefined ? { status } : {}),
      ...(parsedAuthorId !== undefined && !Number.isNaN(parsedAuthorId)
        ? { authorId: parsedAuthorId }
        : {}),
    });
  }

  @Get(':ticketId')
  async findOne(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<Ticket> {
    return this.ticketsService.findOne(ticketId);
  }

  @Post()
  async create(@Body() body: CreateTicketInput): Promise<Ticket> {
    return this.ticketsService.create(body);
  }

  @Delete(':ticketId')
  @HttpCode(204)
  async remove(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<void> {
    await this.ticketsService.remove(ticketId);
  }
}
