from django.urls import path
from . import views  # 'from app1 import views'도 가능

urlpatterns = [
    path('hello/', views.hello_world),
    path('menu/', views.menu_view, name='menu_view'),
]

