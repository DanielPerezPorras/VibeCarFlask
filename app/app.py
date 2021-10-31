from flask import Flask



app = Flask(__name__)

from .routes.test import *
from .rest.user import *