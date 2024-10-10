from django.contrib import admin
from django.urls import path
from .views import home
from .views import RadioNewsView, DateMaxView, EntropyView, CityPopulationView, ClaimsView, NetworksView
from .views import StatesView, CountyView, StateSentimentView, CountySentimentView, SentimentPlotsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
    path('api/state-data/', StatesView.as_view(), name='state-data'),
    path('api/county-data/', CountyView.as_view(), name='county-data'),
    path('api/radio-news/', RadioNewsView.as_view(), name='radio-news'),
    path('api/date-max/', DateMaxView.as_view(), name='date-max'),
    path('api/state-sentiment/<str:fromDate>/<str:toDate>/', StateSentimentView.as_view(), name='state-sentiment'),
    path('api/county-sentiment/<str:fromDate>/<str:toDate>/', CountySentimentView.as_view(), name='county-sentiment'),
    path('api/sentiment-plots/', SentimentPlotsView.as_view(), name='sentiment-plots'),
    path('api/entropy/', EntropyView.as_view(), name='entropy'),
    path('api/city-population/', CityPopulationView.as_view(), name='city-population'),
    path('api/claims/', ClaimsView.as_view(), name='claims'),
    path('api/networks/', NetworksView.as_view(), name='networks'),
]