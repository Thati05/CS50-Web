from django import forms

class CreateForm(forms.Form):
    title = forms.CharField(label="Title")
    description = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'small-textarea'}),
        label="Content"
    )
