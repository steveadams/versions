# Version comparison algorithm

A simple algorithm for comparing lists of strings like:

1. `"1.01,>2.1"`
2. `"3,<=2"`
3. `"3.01,>=3.10"`

Where the comparisons will be:

1. `1.01 > 2.1`
2. `3.0 <= 2.0`
3. `3.01 >= 3.10`

TODO:

1. Find a way to reduce repetition across comparison functions
2. Improve types (Range is very expensive, not particularly helpful for example)
3. Find more bugs
