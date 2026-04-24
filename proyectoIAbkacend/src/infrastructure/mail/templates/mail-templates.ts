interface Template {
  subject: string;
  text: string;
  html: string;
}

interface RegistrationTemplateInput {
  name: string;
  role: string;
}

interface TicketAssignmentTemplateInput {
  name: string;
  ticketCode: string;
  ticketTitle: string;
  assignedBy: string;
}

interface TicketClosureTemplateInput {
  name: string;
  ticketCode: string;
  ticketTitle: string;
  closedBy: string;
}

export function buildRegistrationTemplate(
  input: RegistrationTemplateInput,
): Template {
  return {
    subject: `Bienvenido a Proyecto IA - ${input.role}`,
    text: `Hola ${input.name},\n\nTu acceso ha sido creado exitosamente con el rol ${input.role}.\n\nEquipo Proyecto IA`,
    html: `<p>Hola <strong>${input.name}</strong>,</p><p>Tu acceso ha sido creado exitosamente con el rol <strong>${input.role}</strong>.</p><p>Equipo Proyecto IA</p>`,
  };
}

export function buildTicketAssignmentTemplate(
  input: TicketAssignmentTemplateInput,
): Template {
  return {
    subject: `Ticket asignado ${input.ticketCode}`,
    text: `Hola ${input.name},\n\nEl ticket ${input.ticketCode} (${input.ticketTitle}) fue asignado por ${input.assignedBy}.\n\nEquipo Proyecto IA`,
    html: `<p>Hola <strong>${input.name}</strong>,</p><p>El ticket <strong>${input.ticketCode}</strong> (${input.ticketTitle}) fue asignado por <strong>${input.assignedBy}</strong>.</p><p>Equipo Proyecto IA</p>`,
  };
}

export function buildTicketClosureTemplate(
  input: TicketClosureTemplateInput,
): Template {
  return {
    subject: `Ticket resuelto ${input.ticketCode}`,
    text: `Hola ${input.name},\n\nEl ticket ${input.ticketCode} (${input.ticketTitle}) fue marcado como resuelto por ${input.closedBy}.\n\nEquipo Proyecto IA`,
    html: `<p>Hola <strong>${input.name}</strong>,</p><p>El ticket <strong>${input.ticketCode}</strong> (${input.ticketTitle}) fue marcado como resuelto por <strong>${input.closedBy}</strong>.</p><p>Equipo Proyecto IA</p>`,
  };
}
