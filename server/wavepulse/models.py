from django.db import models

class States(models.Model):
    IdKey = models.AutoField(primary_key=True) 
    ID = models.IntegerField()
    State = models.CharField(max_length=255)
    Abbreviation = models.CharField(max_length=3)
    Latitude = models.DecimalField(max_digits=5, decimal_places=2)
    Longitude = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'states'

class County(models.Model):
    IdKey = models.AutoField(primary_key=True)
    ID = models.IntegerField()
    State = models.CharField(max_length=255)
    CountyName = models.CharField(max_length=255)

    class Meta:
        db_table = 'county'

class RadioNews(models.Model):
    IdKey = models.AutoField(primary_key=True)  
    Abbreviation = models.CharField(max_length=255)
    State = models.CharField(max_length=255)
    Time_Zone = models.CharField(max_length=255) 
    City = models.CharField(max_length=255) 
    CallSign = models.CharField(max_length=255)
    Frequency = models.CharField(max_length=255) 
    Format = models.CharField(max_length=255) 
    NYC_Listening_Range = models.BooleanField()
    Latitude = models.DecimalField(max_digits=5, decimal_places=2)
    Longitude = models.DecimalField(max_digits=5, decimal_places=2) 

    class Meta:
        db_table = 'radionewscorpus'

class StateSentiment(models.Model):
    IdKey = models.AutoField(primary_key=True)
    ID = models.IntegerField()
    Date = models.DateField()
    State = models.CharField(max_length=100)
    Abbreviation = models.CharField(max_length=2)
    Call_Sign = models.CharField(max_length=10)
    
    # Biden Data
    Biden_Positive_Count = models.IntegerField()
    Biden_Neutral_Count = models.IntegerField()
    Biden_Negative_Count = models.IntegerField()
    Biden_Count = models.IntegerField()
    Biden_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Harris Data
    Harris_Positive_Count = models.IntegerField()
    Harris_Neutral_Count = models.IntegerField()
    Harris_Negative_Count = models.IntegerField()
    Harris_Count = models.IntegerField()
    Harris_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Trump Data
    Trump_Positive_Count = models.IntegerField()
    Trump_Neutral_Count = models.IntegerField()
    Trump_Negative_Count = models.IntegerField()
    Trump_Count = models.IntegerField()
    Trump_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Democrats Data
    Democrats_Positive_Count = models.IntegerField()
    Democrats_Neutral_Count = models.IntegerField()
    Democrats_Negative_Count = models.IntegerField()
    Democrats_Count = models.IntegerField()
    Democrats_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Republicans Data
    Republicans_Positive_Count = models.IntegerField()
    Republicans_Neutral_Count = models.IntegerField()
    Republicans_Negative_Count = models.IntegerField()
    Republicans_Count = models.IntegerField()
    Republicans_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Taylor Swift Data
    Taylor_Swift_Positive_Count = models.IntegerField()
    Taylor_Swift_Neutral_Count = models.IntegerField()
    Taylor_Swift_Negative_Count = models.IntegerField()
    Taylor_Swift_Count = models.IntegerField()
    Taylor_Swift_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Elon Musk Data
    Musk_Positive_Count = models.IntegerField()
    Musk_Neutral_Count = models.IntegerField()
    Musk_Negative_Count = models.IntegerField()
    Musk_Count = models.IntegerField()
    Musk_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Olympics Data
    Olympics_Positive_Count = models.IntegerField()
    Olympics_Neutral_Count = models.IntegerField()
    Olympics_Negative_Count = models.IntegerField()
    Olympics_Count = models.IntegerField()
    Olympics_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'state-sentiment'

class CountySentiment(models.Model):
    IdKey = models.AutoField(primary_key=True)
    ID = models.IntegerField()
    Date = models.DateField()
    State = models.CharField(max_length=100)
    CountyName = models.CharField(max_length=100)
    
    # Biden Data
    Biden_Positive_Count = models.IntegerField()
    Biden_Neutral_Count = models.IntegerField()
    Biden_Negative_Count = models.IntegerField()
    Biden_Count = models.IntegerField()
    Biden_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Harris Data
    Harris_Positive_Count = models.IntegerField()
    Harris_Neutral_Count = models.IntegerField()
    Harris_Negative_Count = models.IntegerField()
    Harris_Count = models.IntegerField()
    Harris_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Trump Data
    Trump_Positive_Count = models.IntegerField()
    Trump_Neutral_Count = models.IntegerField()
    Trump_Negative_Count = models.IntegerField()
    Trump_Count = models.IntegerField()
    Trump_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Democrats Data
    Democrats_Positive_Count = models.IntegerField()
    Democrats_Neutral_Count = models.IntegerField()
    Democrats_Negative_Count = models.IntegerField()
    Democrats_Count = models.IntegerField()
    Democrats_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Republicans Data
    Republicans_Positive_Count = models.IntegerField()
    Republicans_Neutral_Count = models.IntegerField()
    Republicans_Negative_Count = models.IntegerField()
    Republicans_Count = models.IntegerField()
    Republicans_Combined_Sentiment = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'county-sentiment'

class CityPopulation(models.Model):
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    population = models.IntegerField()
    black_population = models.IntegerField()
    hispanic_population = models.IntegerField()
    latitude = models.DecimalField(max_digits=5, decimal_places=2)
    longitude = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        db_table = 'city-population'

class Claims(models.Model):
    IdKey = models.AutoField(primary_key=True)
    Date = models.DateField()
    State = models.CharField(max_length=50)
    Abbreviation = models.CharField(max_length=10)
    Call_Sign = models.CharField(max_length=10)
    Count = models.IntegerField()
    Transcript = models.TextField()

    class Meta:
        db_table = 'claims'

class Networks(models.Model):
    IdKey = models.AutoField(primary_key=True)
    Source = models.CharField(max_length=50)
    Level = models.IntegerField()
    NarrativeKey = models.IntegerField()
    Narrative = models.CharField(max_length=255)

    class Meta:
        db_table = 'networks'