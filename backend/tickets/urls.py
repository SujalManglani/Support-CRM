from django.urls import path
from .views import ticket_list_create, ticket_detail

urlpatterns = [
    path('', ticket_list_create),
    path('<int:pk>/', ticket_detail),
]