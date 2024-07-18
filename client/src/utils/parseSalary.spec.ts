import { parseSalary } from './parseSalary';

describe('parseSalary', () => {
    it('should return 0 for input ""', () => {
        expect(parseSalary("")).toBe(0);
    });

    it('should return 0 for input "n/a"', () => {
        expect(parseSalary("")).toBe(0);
    });

    it('should return 100000 for input "100000"', () => {
        expect(parseSalary("100000")).toBe(100000);
    });

    it('should return 100000 for input "100k"', () => {
        expect(parseSalary("100k")).toBe(100000);
    });

    it('should return 100000 for input "$100000"', () => {
        expect(parseSalary("$100000")).toBe(100000);
    });

    it('should return 100000 for input "$100k"', () => {
        expect(parseSalary("$100k")).toBe(100000);
    });

    it('should return 150000 for input "100000 - 200000"', () => {
        expect(parseSalary("100000 - 200000")).toBe(150000);
    });

    it('should return 150000 for input "100k - 200k"', () => {
        expect(parseSalary("100k - 200k")).toBe(150000);
    });

    it('should return 150000 for input "$100000 - $200000"', () => {
        expect(parseSalary("$100000 - $200000")).toBe(150000);
    });

    it('should return 150000 for input "$100k - $200k"', () => {
        expect(parseSalary("$100k - $200k")).toBe(150000);
    });

    it('should return 150000 for input "$100000/yr - $200000/yr"', () => {
        expect(parseSalary("$100000/yr - $200000/yr")).toBe(150000);
    });

    it('should return 150000 for input "$100k/yr - $200k/yr"', () => {
        expect(parseSalary("$100k/yr - $200k/yr")).toBe(150000);
    });

    it('should return 166400 for input "$80/hr - $90/hr"', () => {
        expect(parseSalary("$80/hr - $90/hr")).toBe(176800);
    });

    it('should return 166400 for input "$80/h - $90/h"', () => {
        expect(parseSalary("$80/h - $90/h")).toBe(176800);
    });

    it('should return 166400 for input "80/h - 90/h"', () => {
        expect(parseSalary("80/h - 90/h")).toBe(176800);
    });
});
