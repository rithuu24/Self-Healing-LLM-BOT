import pytest
from src.calculator import add, subtract

def test_add_correctly():
    # This assertion is WRONG on purpose so the test fails.
    # The bot should fix this to be 'assert add(2, 2) == 4'
    assert add(2, 2) == 5 

def test_subtract_correctly():
    # This is correct and should pass
    assert subtract(5, 3) == 2