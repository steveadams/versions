# Version comparison algorithm

A simple algorithm for comparing lists of strings like:

1. `"1.01,>2.1"`
2. `"3,<=2"`
3. `"3.01,>=3.1"`

Where the comparisons will be:

1. `1.01 > 2.1`
2. `3.0 <= 2.0`
3. `3.01 >= 3.1`

## Running tests

Run `yarn` and then `yarn test` to get a verbose output of the test results.

## TODO

Here are some things that would improve the code:

1. Better test cases
2. Could probably write a simple and fast enough regex for parsing in one pass
3. Improve types
4. Find and resolve more bugs
