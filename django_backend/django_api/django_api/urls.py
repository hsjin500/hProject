# urls.py

from django.contrib import admin
from django.urls import path, include  # include를 추가로 import


urlpatterns = [
    path('admin/', admin.site.urls),
    path('django/app1/', include('app1.urls')),  # app1의 urls.py를 include
]
