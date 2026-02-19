import unittest

# Source code functions (as provided in the SOURCE CODE section)
def add(a, b):
    """
    Adds two numbers and returns the result.
    """
    return a + b

def subtract(a, b):
    """
    Subtracts b from a and returns the result.
    """
    return a - b

# Test file logic to be fixed/created
class TestMathFunctions(unittest.TestCase):

    def test_add_positive_numbers(self):
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(0, 0), 0)
        self.assertEqual(add(100, 200), 300)

    def test_add_negative_numbers(self):
        self.assertEqual(add(-1, -1), -2)
        self.assertEqual(add(-5, 3), -2)
        self.assertEqual(add(3, -5), -2)

    def test_add_float_numbers(self):
        self.assertAlmostEqual(add(0.1, 0.2), 0.3)
        self.assertAlmostEqual(add(1.5, 2.5), 4.0)
        self.assertAlmostEqual(add(-1.0, 1.0), 0.0)

    def test_subtract_positive_numbers(self):
        self.assertEqual(subtract(5, 3), 2)
        self.assertEqual(subtract(3, 5), -2)
        self.assertEqual(subtract(10, 0), 10)
        self.assertEqual(subtract(0, 5), -5)

    def test_subtract_negative_numbers(self):
        self.assertEqual(subtract(-5, -3), -2)
        self.assertEqual(subtract(-3, -5), 2)
        self.assertEqual(subtract(5, -3), 8)
        self.assertEqual(subtract(-5, 3), -8)

    def test_subtract_float_numbers(self):
        self.assertAlmostEqual(subtract(0.3, 0.1), 0.2)
        self.assertAlmostEqual(subtract(5.0, 2.5), 2.5)
        self.assertAlmostEqual(subtract(2.5, 5.0), -2.5)

if __name__ == '__main__':
    unittest.main()