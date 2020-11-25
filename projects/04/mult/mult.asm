// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// a: args = meb[0]
@R0 // A = 0
D=M // D = Meb[A] = Meb[0]
@a
M=D

// b: args = meb[1]
@R1 // A = 1
D=M // D = Meb[A] = Meb[1]
@b
M=D

// result = 0
@R2 // A = 2
M = 0 // Meb[A] = Meb[2] = 0

// if a === 0 || b === 0 then goto end
@a
D=M
@end
D;JEQ
@b
D=M
@end
D;JEQ
// else goto mult
@mult
0;JMP


(mult)
@a
D=M
@R2 // A = 2
// result = result + a
M = M + D

// if b < 0 goto increment
@b
D=M
@increment
D;JLT
// else if b > 0 goto decrease
@decrease
D;JGT


(increment)
@b
M = M + 1
D=M
// if b === 0 goto end
@end
D;JEQ
// else goto mult
@mult
0;JMP

(decrease)
@b
M = M - 1
D=M
// if b === 0 goto end
@end
D;JEQ
// else goto mult
@mult
0;JMP


(end)
@end
0;JMP
