import pytest
from src.calculator import add, subtract

def test_add_correctly():
    # BROKEN ON PURPOSE: 2 + 2 is NOT 5
    # The Bot should fix this to be 4
    assert add(2, 2) == 5

def test_subtract_correctly():
    assert subtract(5, 3) == 2