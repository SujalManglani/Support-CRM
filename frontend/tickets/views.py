from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Ticket
from .serializers import TicketSerializer


@api_view(['GET', 'POST'])
def ticket_list_create(request):

    # GET all tickets
    if request.method == 'GET':
        tickets = Ticket.objects.all()
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

    # CREATE ticket
    elif request.method == 'POST':
        data = request.data

        ticket_count = Ticket.objects.count() + 1
        ticket_id = f"TKT-{ticket_count:03d}"

        ticket = Ticket.objects.create(
            ticket_id=ticket_id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            subject=data.get('subject'),
            description=data.get('description'),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'open'),
        )

        serializer = TicketSerializer(ticket)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def ticket_detail(request, pk):

    try:
        ticket = Ticket.objects.get(pk=pk)

    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # GET single ticket
    if request.method == 'GET':
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)

    # UPDATE ticket
    elif request.method == 'PUT':
        serializer = TicketSerializer(ticket, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE ticket
    elif request.method == 'DELETE':
        ticket.delete()

        return Response(
            {'message': 'Ticket deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )