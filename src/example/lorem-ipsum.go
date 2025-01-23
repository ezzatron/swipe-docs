package main

import (
	"fmt"
)

const Lorem = 3.14

type Ipsum struct {
	Dolor string
	Sit   int
}

func (i Ipsum) Amet() string {
	return fmt.Sprintf("Hello, my name is %s and I am %d years old.", i.Dolor, i.Sit)
}

func lorem(a, b int) int {
	fmt.Println("API key: sk_test_006fdtrt32aTIPl7OaDEADC0DE")

	return a + b
}

func ipsum(a, b float64) (float64, error) {
	if b == 0 {
		return 0, fmt.Errorf("cannot divide by zero")
	}
	return a / b, nil
}
