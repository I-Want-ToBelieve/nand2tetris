// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

@24576 // 256 * 32 + 16384 = 24576
D=A
@count
M=D

@color // black = -1  white = 0
M=0

@successively // increasing = 1 descending = -1
M=1

@SCREEN // base
D=A
@current
M=D


(EndlessLoop)
// if key = 0 goto DrawWhite
@KBD
D=M
@DrawWhite
D;JEQ
// else goto DrawBlack
@DrawBlack
0;JMP


(DrawBlack)
// if color !== white goto EndlessLoop
@color
D=M+1 // -1 + 1
@EndlessLoop
D;JEQ
// color = black  successively = 1
@color
M=-1
@successively
M=1
// else goto Draw
@Draw
0;JMP

(DrawWhite)
// if color !== black goto EndlessLoop
@color
D=M
@EndlessLoop
D;JEQ
// color = white  successively = -1
@color
M=0
@successively
M=-1
// else goto Draw
@Draw
0;JMP

(Draw)
@color
D=M
@current
A=M
M=D //  draw current 16 bit (white or black)

@successively
D=M
@current // current = current + 1 or current - 1
M=M+D

// if color = 0 (white) goto White else goto Black
@color
D=M
@White
D;JEQ
@Black
0;JMP

(White)
// if current == @SCREEN - 1 goto EndlessLoop
@SCREEN
D=A
@current
D=D-M
// goto EndlessLoop
@EndlessLoop
D-1;JEQ
// else goto Draw
@Draw
0;JMP

(Black)
// if current == count goto EndlessLoop
@count
D=M
@current
D=D-M
// goto EndlessLoop
@EndlessLoop
D;JEQ
// else goto Draw
@Draw
0;JMP



