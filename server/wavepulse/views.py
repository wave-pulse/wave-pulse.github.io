import numpy as np
import pandas as pd
from datetime import timedelta
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db.models import Avg, F, ExpressionWrapper, DecimalField, IntegerField
from .models import States, County, RadioNews, StateSentiment, CountySentiment, CityPopulation, Claims, Networks
from .serializers import RadioNewsSerializer, DateMaxSerializer, CityPopulationSerializer, ClaimsSerializer, NetworksSerializer
from .serializers import StatesSerializer, CountySerializer, StateSentimentSerializer, CountySentimentSerializer, SentimentPlotsSerializer

def home(request):
    response = HttpResponse("Welcome to Wave Pulse API")
    return response

class StatesView(generics.ListAPIView):
    queryset = States.objects.all()
    serializer_class = StatesSerializer

class CountyView(generics.ListAPIView):
    queryset = County.objects.all()
    serializer_class = CountySerializer

class RadioNewsView(generics.ListAPIView):
    queryset = RadioNews.objects.all()
    serializer_class = RadioNewsSerializer

class DateMaxView(generics.ListAPIView):
    serializer_class = DateMaxSerializer

    def get(self, request, *args, **kwargs):
        toDate = StateSentiment.objects.latest('Date')
        toDate = toDate.Date
        fromDate = toDate - timedelta(days=6)
        response_data = {
            "fromDate": fromDate,
            "toDate": toDate
        }
        return Response(response_data)

class StateSentimentView(generics.GenericAPIView):
    serializer_class = StateSentimentSerializer

    def get(self, request, fromDate, toDate, *args, **kwargs):
        context = {'fromDate': fromDate, 'toDate': toDate}
        instance = StateSentiment()  
        serializer = self.get_serializer(instance, context=context)
        return Response(serializer.data)

class CountySentimentView(generics.GenericAPIView):
    serializer_class = CountySentimentSerializer

    def get(self, request, fromDate, toDate, *args, **kwargs):
        context = {'fromDate': fromDate, 'toDate': toDate}
        instance = CountySentiment()  
        serializer = self.get_serializer(instance, context=context)
        return Response(serializer.data)

class SentimentPlotsView(generics.ListAPIView):
    serializer_class = SentimentPlotsSerializer

    def get_queryset(self):
        queryset = StateSentiment.objects.values('Date').annotate(
            
            # Biden Data
            Biden_Positive_Count=ExpressionWrapper(Avg('Biden_Positive_Count'), output_field=IntegerField()),
            Biden_Neutral_Count=ExpressionWrapper(Avg('Biden_Neutral_Count'), output_field=IntegerField()),
            Biden_Negative_Count=ExpressionWrapper(Avg('Biden_Negative_Count'), output_field=IntegerField()),
            Biden_Count=ExpressionWrapper(Avg('Biden_Count'), output_field=IntegerField()),
            Biden_Combined_Sentiment=ExpressionWrapper(Avg(F('Biden_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Harris Data
            Harris_Positive_Count=ExpressionWrapper(Avg('Harris_Positive_Count'), output_field=IntegerField()),
            Harris_Neutral_Count=ExpressionWrapper(Avg('Harris_Neutral_Count'), output_field=IntegerField()),
            Harris_Negative_Count=ExpressionWrapper(Avg('Harris_Negative_Count'), output_field=IntegerField()),
            Harris_Count=ExpressionWrapper(Avg('Harris_Count'), output_field=IntegerField()),
            Harris_Combined_Sentiment=ExpressionWrapper(Avg(F('Harris_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Trump Data
            Trump_Positive_Count=ExpressionWrapper(Avg('Trump_Positive_Count'), output_field=IntegerField()),
            Trump_Neutral_Count=ExpressionWrapper(Avg('Trump_Neutral_Count'), output_field=IntegerField()),
            Trump_Negative_Count=ExpressionWrapper(Avg('Trump_Negative_Count'), output_field=IntegerField()),
            Trump_Count=ExpressionWrapper(Avg('Trump_Count'), output_field=IntegerField()),
            Trump_Combined_Sentiment=ExpressionWrapper(Avg(F('Trump_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Democrats Data
            Democrats_Positive_Count=ExpressionWrapper(Avg('Democrats_Positive_Count'), output_field=IntegerField()),
            Democrats_Neutral_Count=ExpressionWrapper(Avg('Democrats_Neutral_Count'), output_field=IntegerField()),
            Democrats_Negative_Count=ExpressionWrapper(Avg('Democrats_Negative_Count'), output_field=IntegerField()),
            Democrats_Count=ExpressionWrapper(Avg('Democrats_Count'), output_field=IntegerField()),
            Democrats_Combined_Sentiment=ExpressionWrapper(Avg(F('Democrats_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Republicans Data
            Republicans_Positive_Count=ExpressionWrapper(Avg('Republicans_Positive_Count'), output_field=IntegerField()),
            Republicans_Neutral_Count=ExpressionWrapper(Avg('Republicans_Neutral_Count'), output_field=IntegerField()),
            Republicans_Negative_Count=ExpressionWrapper(Avg('Republicans_Negative_Count'), output_field=IntegerField()),
            Republicans_Count=ExpressionWrapper(Avg('Republicans_Count'), output_field=IntegerField()),
            Republicans_Combined_Sentiment=ExpressionWrapper(Avg(F('Republicans_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Taylor Swift Data
            Taylor_Swift_Positive_Count=ExpressionWrapper(Avg('Taylor_Swift_Positive_Count'), output_field=IntegerField()),
            Taylor_Swift_Neutral_Count=ExpressionWrapper(Avg('Taylor_Swift_Neutral_Count'), output_field=IntegerField()),
            Taylor_Swift_Negative_Count=ExpressionWrapper(Avg('Taylor_Swift_Negative_Count'), output_field=IntegerField()),
            Taylor_Swift_Count=ExpressionWrapper(Avg('Taylor_Swift_Count'), output_field=IntegerField()),
            Taylor_Swift_Combined_Sentiment=ExpressionWrapper(Avg(F('Taylor_Swift_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Elon Musk Data
            Musk_Positive_Count=ExpressionWrapper(Avg('Musk_Positive_Count'), output_field=IntegerField()),
            Musk_Neutral_Count=ExpressionWrapper(Avg('Musk_Neutral_Count'), output_field=IntegerField()),
            Musk_Negative_Count=ExpressionWrapper(Avg('Musk_Negative_Count'), output_field=IntegerField()),
            Musk_Count=ExpressionWrapper(Avg('Musk_Count'), output_field=IntegerField()),
            Musk_Combined_Sentiment=ExpressionWrapper(Avg(F('Musk_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2)),

            # Olympics Data
            Olympics_Positive_Count=ExpressionWrapper(Avg('Olympics_Positive_Count'), output_field=IntegerField()),
            Olympics_Neutral_Count=ExpressionWrapper(Avg('Olympics_Neutral_Count'), output_field=IntegerField()),
            Olympics_Negative_Count=ExpressionWrapper(Avg('Olympics_Negative_Count'), output_field=IntegerField()),
            Olympics_Count=ExpressionWrapper(Avg('Olympics_Count'), output_field=IntegerField()),
            Olympics_Combined_Sentiment=ExpressionWrapper(Avg(F('Olympics_Combined_Sentiment') * 100), output_field=DecimalField(max_digits=5, decimal_places=2))
        ).order_by('Date')
        
        return queryset

class EntropyView(APIView):

    def calculate_entropy(self, column):
        counts = column.value_counts()
        probabilities = counts / len(column)
        entropy = -np.sum(probabilities * np.log2(probabilities))
        entropy = round(entropy, 2)
        return entropy

    def get(self, request, *args, **kwargs):
        entropies = {}
        queryset = StateSentiment.objects.all()
        
        if queryset.exists():
            df = pd.DataFrame.from_records(queryset.values(
                "Biden_Positive_Count", "Biden_Neutral_Count", "Biden_Negative_Count", "Biden_Count", "Biden_Combined_Sentiment",
                "Harris_Positive_Count", "Harris_Neutral_Count", "Harris_Negative_Count", "Harris_Count", "Harris_Combined_Sentiment",
                "Trump_Positive_Count", "Trump_Neutral_Count", "Trump_Negative_Count", "Trump_Count", "Trump_Combined_Sentiment",
                "Democrats_Positive_Count", "Democrats_Neutral_Count", "Democrats_Negative_Count", "Democrats_Count", "Democrats_Combined_Sentiment",
                "Republicans_Positive_Count", "Republicans_Neutral_Count", "Republicans_Negative_Count", "Republicans_Count", "Republicans_Combined_Sentiment"
            ))

            for column in df.columns:
                column_data = df[column].dropna()  
                if not column_data.empty:
                    entropies[column] = self.calculate_entropy(column_data)
        
        return Response(entropies)

class CityPopulationView(generics.ListCreateAPIView):
    queryset = CityPopulation.objects.all()
    serializer_class = CityPopulationSerializer

class ClaimsView(generics.ListCreateAPIView):
    queryset = Claims.objects.all()
    serializer_class = ClaimsSerializer

class NetworksView(generics.ListCreateAPIView):
    queryset = Networks.objects.all()
    serializer_class = NetworksSerializer
