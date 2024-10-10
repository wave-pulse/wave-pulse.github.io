import datetime
from datetime import timedelta
from rest_framework import serializers
from django.db.models import Avg
from .models import States, County, RadioNews, StateSentiment, CountySentiment, CityPopulation, Claims, Networks

class StatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = States
        fields = '__all__'

class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = '__all__'

class RadioNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RadioNews
        fields = '__all__'

class DateMaxSerializer(serializers.ModelSerializer):
    toDate = serializers.SerializerMethodField()
    fromDate = serializers.SerializerMethodField()   

    class Meta:
        model = StateSentiment
        fields = [
            'fromDate',
            'toDate'
        ]

    def get_toDate(self, obj):
        toDate = StateSentiment.objects.latest('Date')
        return toDate.Date
    
    def get_fromDate(self, obj):
        toDate = StateSentiment.objects.latest('Date')
        return toDate.Date - timedelta(days=7)

class StateSentimentSerializer(serializers.ModelSerializer):

    # Biden Data
    Biden_Positive_Count = serializers.IntegerField()
    Biden_Neutral_Count = serializers.IntegerField()
    Biden_Negative_Count = serializers.IntegerField()
    Biden_Count = serializers.IntegerField()
    Biden_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Harris Data
    Harris_Positive_Count = serializers.IntegerField()
    Harris_Neutral_Count = serializers.IntegerField()
    Harris_Negative_Count = serializers.IntegerField()
    Harris_Count = serializers.IntegerField()
    Harris_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Trump Data
    Trump_Positive_Count = serializers.IntegerField()
    Trump_Neutral_Count = serializers.IntegerField()
    Trump_Negative_Count = serializers.IntegerField()
    Trump_Count = serializers.IntegerField()
    Trump_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Democrats Data
    Democrats_Positive_Count = serializers.IntegerField()
    Democrats_Neutral_Count = serializers.IntegerField()
    Democrats_Negative_Count = serializers.IntegerField()
    Democrats_Count = serializers.IntegerField()
    Democrats_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Republicans Data
    Republicans_Positive_Count = serializers.IntegerField()
    Republicans_Neutral_Count = serializers.IntegerField()
    Republicans_Negative_Count = serializers.IntegerField()
    Republicans_Count = serializers.IntegerField()
    Republicans_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Taylor Swift Data
    Taylor_Swift_Positive_Count = serializers.IntegerField()
    Taylor_Swift_Neutral_Count = serializers.IntegerField()
    Taylor_Swift_Negative_Count = serializers.IntegerField()
    Taylor_Swift_Count = serializers.IntegerField()
    Taylor_Swift_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Elon Musk Data
    Musk_Positive_Count = serializers.IntegerField()
    Musk_Neutral_Count = serializers.IntegerField()
    Musk_Negative_Count = serializers.IntegerField()
    Musk_Count = serializers.IntegerField()
    Musk_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Olympics Data
    Olympics_Positive_Count = serializers.IntegerField()
    Olympics_Neutral_Count = serializers.IntegerField()
    Olympics_Negative_Count = serializers.IntegerField()
    Olympics_Count = serializers.IntegerField()
    Olympics_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        model = StateSentiment
        fields = [
            'Biden_Positive_Count',
            'Biden_Neutral_Count',
            'Biden_Negative_Count',
            'Biden_Count',
            'Biden_Combined_Sentiment',
            'Harris_Positive_Count',
            'Harris_Neutral_Count',
            'Harris_Negative_Count',
            'Harris_Count',
            'Harris_Combined_Sentiment',
            'Trump_Positive_Count',
            'Trump_Neutral_Count',
            'Trump_Negative_Count',
            'Trump_Count',
            'Trump_Combined_Sentiment',
            'Democrats_Positive_Count',
            'Democrats_Neutral_Count',
            'Democrats_Negative_Count',
            'Democrats_Count',
            'Democrats_Combined_Sentiment',
            'Republicans_Positive_Count',
            'Republicans_Neutral_Count',
            'Republicans_Negative_Count',
            'Republicans_Count',
            'Republicans_Combined_Sentiment',
            'Taylor_Swift_Positive_Count',
            'Taylor_Swift_Neutral_Count',
            'Taylor_Swift_Negative_Count',
            'Taylor_Swift_Count',
            'Taylor_Swift_Combined_Sentiment',
            'Musk_Positive_Count',
            'Musk_Neutral_Count',
            'Musk_Negative_Count',
            'Musk_Count',
            'Musk_Combined_Sentiment',
            'Olympics_Positive_Count',
            'Olympics_Neutral_Count',
            'Olympics_Negative_Count',
            'Olympics_Count',
            'Olympics_Combined_Sentiment',
        ]

    def to_representation(self, instance):
        fromDate = datetime.datetime.strptime(self.context.get('fromDate'), '%Y-%m-%d')
        toDate = datetime.datetime.strptime(self.context.get('toDate'), '%Y-%m-%d')
        if fromDate and toDate:
            # Group by state and aggregate sentiments and counts
            state_data = StateSentiment.objects.filter(Date__range=[fromDate, toDate]).values('ID', 'State').annotate(
                Biden_Positive_Count=Avg('Biden_Positive_Count'),
                Biden_Neutral_Count=Avg('Biden_Neutral_Count'),
                Biden_Negative_Count=Avg('Biden_Negative_Count'),
                Biden_Count=Avg('Biden_Count'),
                Biden_Combined_Sentiment=Avg('Biden_Combined_Sentiment'),

                Harris_Positive_Count=Avg('Harris_Positive_Count'),
                Harris_Neutral_Count=Avg('Harris_Neutral_Count'),
                Harris_Negative_Count=Avg('Harris_Negative_Count'),
                Harris_Count=Avg('Harris_Count'),
                Harris_Combined_Sentiment=Avg('Harris_Combined_Sentiment'),

                Trump_Positive_Count=Avg('Trump_Positive_Count'),
                Trump_Neutral_Count=Avg('Trump_Neutral_Count'),
                Trump_Negative_Count=Avg('Trump_Negative_Count'),
                Trump_Count=Avg('Trump_Count'),
                Trump_Combined_Sentiment=Avg('Trump_Combined_Sentiment'),

                Democrats_Positive_Count=Avg('Democrats_Positive_Count'),
                Democrats_Neutral_Count=Avg('Democrats_Neutral_Count'),
                Democrats_Negative_Count=Avg('Democrats_Negative_Count'),
                Democrats_Count=Avg('Democrats_Count'),
                Democrats_Combined_Sentiment=Avg('Democrats_Combined_Sentiment'),

                Republicans_Positive_Count=Avg('Republicans_Positive_Count'),
                Republicans_Neutral_Count=Avg('Republicans_Neutral_Count'),
                Republicans_Negative_Count=Avg('Republicans_Negative_Count'),
                Republicans_Count=Avg('Republicans_Count'),
                Republicans_Combined_Sentiment=Avg('Republicans_Combined_Sentiment'),

                Taylor_Swift_Positive_Count=Avg('Taylor_Swift_Positive_Count'),
                Taylor_Swift_Neutral_Count=Avg('Taylor_Swift_Neutral_Count'),
                Taylor_Swift_Negative_Count=Avg('Taylor_Swift_Negative_Count'),
                Taylor_Swift_Count=Avg('Taylor_Swift_Count'),
                Taylor_Swift_Combined_Sentiment=Avg('Taylor_Swift_Combined_Sentiment'),

                Musk_Positive_Count=Avg('Musk_Positive_Count'),
                Musk_Neutral_Count=Avg('Musk_Neutral_Count'),
                Musk_Negative_Count=Avg('Musk_Negative_Count'),
                Musk_Count=Avg('Musk_Count'),
                Musk_Combined_Sentiment=Avg('Musk_Combined_Sentiment'),

                Olympics_Positive_Count=Avg('Olympics_Positive_Count'),
                Olympics_Neutral_Count=Avg('Olympics_Neutral_Count'),
                Olympics_Negative_Count=Avg('Olympics_Negative_Count'),
                Olympics_Count=Avg('Olympics_Count'),
                Olympics_Combined_Sentiment=Avg('Olympics_Combined_Sentiment'),
            )

            # Format the results
            aggregated_data = []
            for entry in state_data:
                formatted_entry = {
                    'ID': entry['ID'],
                    'State': entry['State'],
                    
                    'Biden_Positive_Count': round(entry['Biden_Positive_Count']) if entry['Biden_Positive_Count'] is not None else None,
                    'Biden_Neutral_Count': round(entry['Biden_Neutral_Count']) if entry['Biden_Neutral_Count'] is not None else None,
                    'Biden_Negative_Count': round(entry['Biden_Negative_Count']) if entry['Biden_Negative_Count'] is not None else None,
                    'Biden_Count': round(entry['Biden_Count']) if entry['Biden_Count'] is not None else None,
                    'Biden_Combined_Sentiment': round(entry['Biden_Combined_Sentiment'] * 100, 2) if entry['Biden_Combined_Sentiment'] is not None else None,

                    'Harris_Positive_Count': round(entry['Harris_Positive_Count']) if entry['Harris_Positive_Count'] is not None else None,
                    'Harris_Neutral_Count': round(entry['Harris_Neutral_Count']) if entry['Harris_Neutral_Count'] is not None else None,
                    'Harris_Negative_Count': round(entry['Harris_Negative_Count']) if entry['Harris_Negative_Count'] is not None else None,
                    'Harris_Count': round(entry['Harris_Count']) if entry['Harris_Count'] is not None else None,
                    'Harris_Combined_Sentiment': round(entry['Harris_Combined_Sentiment'] * 100, 2) if entry['Harris_Combined_Sentiment'] is not None else None,

                    'Trump_Positive_Count': round(entry['Trump_Positive_Count']) if entry['Trump_Positive_Count'] is not None else None,
                    'Trump_Neutral_Count': round(entry['Trump_Neutral_Count']) if entry['Trump_Neutral_Count'] is not None else None,
                    'Trump_Negative_Count': round(entry['Trump_Negative_Count']) if entry['Trump_Negative_Count'] is not None else None,
                    'Trump_Count': round(entry['Trump_Count']) if entry['Trump_Count'] is not None else None,
                    'Trump_Combined_Sentiment': round(entry['Trump_Combined_Sentiment'] * 100, 2) if entry['Trump_Combined_Sentiment'] is not None else None,

                    'Democrats_Positive_Count': round(entry['Democrats_Positive_Count']) if entry['Democrats_Positive_Count'] is not None else None,
                    'Democrats_Neutral_Count': round(entry['Democrats_Neutral_Count']) if entry['Democrats_Neutral_Count'] is not None else None,
                    'Democrats_Negative_Count': round(entry['Democrats_Negative_Count']) if entry['Democrats_Negative_Count'] is not None else None,
                    'Democrats_Count': round(entry['Democrats_Count']) if entry['Democrats_Count'] is not None else None,
                    'Democrats_Combined_Sentiment': round(entry['Democrats_Combined_Sentiment'] * 100, 2) if entry['Democrats_Combined_Sentiment'] is not None else None,

                    'Republicans_Positive_Count': round(entry['Republicans_Positive_Count']) if entry['Republicans_Positive_Count'] is not None else None,
                    'Republicans_Neutral_Count': round(entry['Republicans_Neutral_Count']) if entry['Republicans_Neutral_Count'] is not None else None,
                    'Republicans_Negative_Count': round(entry['Republicans_Negative_Count']) if entry['Republicans_Negative_Count'] is not None else None,
                    'Republicans_Count': round(entry['Republicans_Count']) if entry['Republicans_Count'] is not None else None,
                    'Republicans_Combined_Sentiment': round(entry['Republicans_Combined_Sentiment'] * 100, 2) if entry['Republicans_Combined_Sentiment'] is not None else None,

                    'Taylor_Swift_Positive_Count': round(entry['Taylor_Swift_Positive_Count']) if entry['Taylor_Swift_Positive_Count'] is not None else None,
                    'Taylor_Swift_Neutral_Count': round(entry['Taylor_Swift_Neutral_Count']) if entry['Taylor_Swift_Neutral_Count'] is not None else None,
                    'Taylor_Swift_Negative_Count': round(entry['Taylor_Swift_Negative_Count']) if entry['Taylor_Swift_Negative_Count'] is not None else None,
                    'Taylor_Swift_Count': round(entry['Taylor_Swift_Count']) if entry['Taylor_Swift_Count'] is not None else None,
                    'Taylor_Swift_Combined_Sentiment': round(entry['Taylor_Swift_Combined_Sentiment'] * 100, 2) if entry['Taylor_Swift_Combined_Sentiment'] is not None else None,

                    'Musk_Positive_Count': round(entry['Musk_Positive_Count']) if entry['Musk_Positive_Count'] is not None else None,
                    'Musk_Neutral_Count': round(entry['Musk_Neutral_Count']) if entry['Musk_Neutral_Count'] is not None else None,
                    'Musk_Negative_Count': round(entry['Musk_Negative_Count']) if entry['Musk_Negative_Count'] is not None else None,
                    'Musk_Count': round(entry['Musk_Count']) if entry['Musk_Count'] is not None else None,
                    'Musk_Combined_Sentiment': round(entry['Musk_Combined_Sentiment'] * 100, 2) if entry['Musk_Combined_Sentiment'] is not None else None,

                    'Olympics_Positive_Count': round(entry['Olympics_Positive_Count']) if entry['Olympics_Positive_Count'] is not None else None,
                    'Olympics_Neutral_Count': round(entry['Olympics_Neutral_Count']) if entry['Olympics_Neutral_Count'] is not None else None,
                    'Olympics_Negative_Count': round(entry['Olympics_Negative_Count']) if entry['Olympics_Negative_Count'] is not None else None,
                    'Olympics_Count': round(entry['Olympics_Count']) if entry['Olympics_Count'] is not None else None,
                    'Olympics_Combined_Sentiment': round(entry['Olympics_Combined_Sentiment'] * 100, 2) if entry['Olympics_Combined_Sentiment'] is not None else None,
                }
                aggregated_data.append(formatted_entry)
                
            return {
                'fromDate': fromDate.strftime('%Y-%m-%d'),
                'toDate': toDate.strftime('%Y-%m-%d'),
                'Sentiment': aggregated_data
            }
        return {}

class CountySentimentSerializer(serializers.ModelSerializer):

    # Biden Data
    Biden_Positive_Count = serializers.IntegerField()
    Biden_Neutral_Count = serializers.IntegerField()
    Biden_Negative_Count = serializers.IntegerField()
    Biden_Count = serializers.IntegerField()
    Biden_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Harris Data
    Harris_Positive_Count = serializers.IntegerField()
    Harris_Neutral_Count = serializers.IntegerField()
    Harris_Negative_Count = serializers.IntegerField()
    Harris_Count = serializers.IntegerField()
    Harris_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Trump Data
    Trump_Positive_Count = serializers.IntegerField()
    Trump_Neutral_Count = serializers.IntegerField()
    Trump_Negative_Count = serializers.IntegerField()
    Trump_Count = serializers.IntegerField()
    Trump_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Democrats Data
    Democrats_Positive_Count = serializers.IntegerField()
    Democrats_Neutral_Count = serializers.IntegerField()
    Democrats_Negative_Count = serializers.IntegerField()
    Democrats_Count = serializers.IntegerField()
    Democrats_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Republicans Data
    Republicans_Positive_Count = serializers.IntegerField()
    Republicans_Neutral_Count = serializers.IntegerField()
    Republicans_Negative_Count = serializers.IntegerField()
    Republicans_Count = serializers.IntegerField()
    Republicans_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        model = CountySentiment
        fields = [
            'Biden_Positive_Count',
            'Biden_Neutral_Count',
            'Biden_Negative_Count',
            'Biden_Count',
            'Biden_Combined_Sentiment',
            'Harris_Positive_Count',
            'Harris_Neutral_Count',
            'Harris_Negative_Count',
            'Harris_Count',
            'Harris_Combined_Sentiment',
            'Trump_Positive_Count',
            'Trump_Neutral_Count',
            'Trump_Negative_Count',
            'Trump_Count',
            'Trump_Combined_Sentiment',
            'Democrats_Positive_Count',
            'Democrats_Neutral_Count',
            'Democrats_Negative_Count',
            'Democrats_Count',
            'Democrats_Combined_Sentiment',
            'Republicans_Positive_Count',
            'Republicans_Neutral_Count',
            'Republicans_Negative_Count',
            'Republicans_Count',
            'Republicans_Combined_Sentiment',
        ]

    def to_representation(self, instance):
        fromDate = datetime.datetime.strptime(self.context.get('fromDate'), '%Y-%m-%d')
        toDate = datetime.datetime.strptime(self.context.get('toDate'), '%Y-%m-%d')
        if fromDate and toDate:
            # Group by state and aggregate sentiments and counts
            county_data = CountySentiment.objects.filter(Date__range=[fromDate, toDate]).values('ID', 'CountyName', 'State').annotate(
                Biden_Positive_Count=Avg('Biden_Positive_Count'),
                Biden_Neutral_Count=Avg('Biden_Neutral_Count'),
                Biden_Negative_Count=Avg('Biden_Negative_Count'),
                Biden_Count=Avg('Biden_Count'),
                Biden_Combined_Sentiment=Avg('Biden_Combined_Sentiment'),

                Harris_Positive_Count=Avg('Harris_Positive_Count'),
                Harris_Neutral_Count=Avg('Harris_Neutral_Count'),
                Harris_Negative_Count=Avg('Harris_Negative_Count'),
                Harris_Count=Avg('Harris_Count'),
                Harris_Combined_Sentiment=Avg('Harris_Combined_Sentiment'),

                Trump_Positive_Count=Avg('Trump_Positive_Count'),
                Trump_Neutral_Count=Avg('Trump_Neutral_Count'),
                Trump_Negative_Count=Avg('Trump_Negative_Count'),
                Trump_Count=Avg('Trump_Count'),
                Trump_Combined_Sentiment=Avg('Trump_Combined_Sentiment'),

                Democrats_Positive_Count=Avg('Democrats_Positive_Count'),
                Democrats_Neutral_Count=Avg('Democrats_Neutral_Count'),
                Democrats_Negative_Count=Avg('Democrats_Negative_Count'),
                Democrats_Count=Avg('Democrats_Count'),
                Democrats_Combined_Sentiment=Avg('Democrats_Combined_Sentiment'),

                Republicans_Positive_Count=Avg('Republicans_Positive_Count'),
                Republicans_Neutral_Count=Avg('Republicans_Neutral_Count'),
                Republicans_Negative_Count=Avg('Republicans_Negative_Count'),
                Republicans_Count=Avg('Republicans_Count'),
                Republicans_Combined_Sentiment=Avg('Republicans_Combined_Sentiment'),
            )

            # Format the results
            aggregated_data = []
            for entry in county_data:
                formatted_entry = {
                    'ID': entry['ID'],
                    'CountyName': entry['CountyName'],
                    'State': entry['State'],
                    
                    'Biden_Positive_Count': round(entry['Biden_Positive_Count']) if entry['Biden_Positive_Count'] is not None else None,
                    'Biden_Neutral_Count': round(entry['Biden_Neutral_Count']) if entry['Biden_Neutral_Count'] is not None else None,
                    'Biden_Negative_Count': round(entry['Biden_Negative_Count']) if entry['Biden_Negative_Count'] is not None else None,
                    'Biden_Count': round(entry['Biden_Count']) if entry['Biden_Count'] is not None else None,
                    'Biden_Combined_Sentiment': round(entry['Biden_Combined_Sentiment'], 2) if entry['Biden_Combined_Sentiment'] is not None else None,

                    'Harris_Positive_Count': round(entry['Harris_Positive_Count']) if entry['Harris_Positive_Count'] is not None else None,
                    'Harris_Neutral_Count': round(entry['Harris_Neutral_Count']) if entry['Harris_Neutral_Count'] is not None else None,
                    'Harris_Negative_Count': round(entry['Harris_Negative_Count']) if entry['Harris_Negative_Count'] is not None else None,
                    'Harris_Count': round(entry['Harris_Count']) if entry['Harris_Count'] is not None else None,
                    'Harris_Combined_Sentiment': round(entry['Harris_Combined_Sentiment'], 2) if entry['Harris_Combined_Sentiment'] is not None else None,

                    'Trump_Positive_Count': round(entry['Trump_Positive_Count']) if entry['Trump_Positive_Count'] is not None else None,
                    'Trump_Neutral_Count': round(entry['Trump_Neutral_Count']) if entry['Trump_Neutral_Count'] is not None else None,
                    'Trump_Negative_Count': round(entry['Trump_Negative_Count']) if entry['Trump_Negative_Count'] is not None else None,
                    'Trump_Count': round(entry['Trump_Count']) if entry['Trump_Count'] is not None else None,
                    'Trump_Combined_Sentiment': round(entry['Trump_Combined_Sentiment'], 2) if entry['Trump_Combined_Sentiment'] is not None else None,

                    'Democrats_Positive_Count': round(entry['Democrats_Positive_Count']) if entry['Democrats_Positive_Count'] is not None else None,
                    'Democrats_Neutral_Count': round(entry['Democrats_Neutral_Count']) if entry['Democrats_Neutral_Count'] is not None else None,
                    'Democrats_Negative_Count': round(entry['Democrats_Negative_Count']) if entry['Democrats_Negative_Count'] is not None else None,
                    'Democrats_Count': round(entry['Democrats_Count']) if entry['Democrats_Count'] is not None else None,
                    'Democrats_Combined_Sentiment': round(entry['Democrats_Combined_Sentiment'], 2) if entry['Democrats_Combined_Sentiment'] is not None else None,

                    'Republicans_Positive_Count': round(entry['Republicans_Positive_Count']) if entry['Republicans_Positive_Count'] is not None else None,
                    'Republicans_Neutral_Count': round(entry['Republicans_Neutral_Count']) if entry['Republicans_Neutral_Count'] is not None else None,
                    'Republicans_Negative_Count': round(entry['Republicans_Negative_Count']) if entry['Republicans_Negative_Count'] is not None else None,
                    'Republicans_Count': round(entry['Republicans_Count']) if entry['Republicans_Count'] is not None else None,
                    'Republicans_Combined_Sentiment': round(entry['Republicans_Combined_Sentiment'], 2) if entry['Republicans_Combined_Sentiment'] is not None else None,
                }
                aggregated_data.append(formatted_entry)
                
            return {
                'fromDate': fromDate.strftime('%Y-%m-%d'),
                'toDate': toDate.strftime('%Y-%m-%d'),
                'Sentiment': aggregated_data
            }
        return {}

class SentimentPlotsSerializer(serializers.Serializer):
    Date = serializers.DateField()
    
    # Biden Data
    Biden_Positive_Count = serializers.IntegerField()
    Biden_Neutral_Count = serializers.IntegerField()
    Biden_Negative_Count = serializers.IntegerField()
    Biden_Count = serializers.IntegerField()
    Biden_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Harris Data
    Harris_Positive_Count = serializers.IntegerField()
    Harris_Neutral_Count = serializers.IntegerField()
    Harris_Negative_Count = serializers.IntegerField()
    Harris_Count = serializers.IntegerField()
    Harris_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Trump Data
    Trump_Positive_Count = serializers.IntegerField()
    Trump_Neutral_Count = serializers.IntegerField()
    Trump_Negative_Count = serializers.IntegerField()
    Trump_Count = serializers.IntegerField()
    Trump_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Democrats Data
    Democrats_Positive_Count = serializers.IntegerField()
    Democrats_Neutral_Count = serializers.IntegerField()
    Democrats_Negative_Count = serializers.IntegerField()
    Democrats_Count = serializers.IntegerField()
    Democrats_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Republicans Data
    Republicans_Positive_Count = serializers.IntegerField()
    Republicans_Neutral_Count = serializers.IntegerField()
    Republicans_Negative_Count = serializers.IntegerField()
    Republicans_Count = serializers.IntegerField()
    Republicans_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Taylor Swift Data
    Taylor_Swift_Positive_Count = serializers.IntegerField()
    Taylor_Swift_Neutral_Count = serializers.IntegerField()
    Taylor_Swift_Negative_Count = serializers.IntegerField()
    Taylor_Swift_Count = serializers.IntegerField()
    Taylor_Swift_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Elon Musk Data
    Musk_Positive_Count = serializers.IntegerField()
    Musk_Neutral_Count = serializers.IntegerField()
    Musk_Negative_Count = serializers.IntegerField()
    Musk_Count = serializers.IntegerField()
    Musk_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Olympics Data
    Olympics_Positive_Count = serializers.IntegerField()
    Olympics_Neutral_Count = serializers.IntegerField()
    Olympics_Negative_Count = serializers.IntegerField()
    Olympics_Count = serializers.IntegerField()
    Olympics_Combined_Sentiment = serializers.DecimalField(max_digits=5, decimal_places=2)


class CityPopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityPopulation
        fields = '__all__'

class ClaimsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claims
        fields = '__all__'

class NetworksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Networks
        fields = '__all__'
