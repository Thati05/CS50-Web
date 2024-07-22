from django.shortcuts import render, redirect
from . import util
import markdown
from util import CreateForm


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def title(request, title):
    entry = util.get_entry(title)
    if entry is None:
        return render(request, "encyclopedia/not_found.html", {
            "title": title
        })
    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "entry": markdown.markdown(entry)
    })


def createPage(request):
    form = CreateForm()
    context = {'form': form}
    if request == "POST":
        request.POST.get('title', 'description')
        if form.is_valid():
            form.save()
            return render(request, 'encyclopedia/create-html', context)
    return redirect('index')