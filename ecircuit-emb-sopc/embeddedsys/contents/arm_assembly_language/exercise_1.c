/*
MOVW r0,0XE020
MOVW r1,0x0280
LSL r0,#0F        把高16位移到r0的高16位
ORR r0,r0,r1    合成32位的数
*/
struct instuctionlist
{
	int volume;
	char *ip;
};
asmldr(char syntaxlist[4][20], int 4)
{
	short imm16_high,imm16_low;
	instuctionlist ldrsame;
	char *p;
	p=malloc(16);
	ldrsame.ip=p;
	ldrsame.volume=16;
	
    if(strcmp(syntaxlist[0],"ldr")==0)
    {
        if(strcmp(syntaxlist[3][0],"=")==0)
        {
            //imm16_high=chartoint(syntaxlist[3][3])*4096+chartoint(syntaxlist[3][4])*256+chartoint(syntaxlist[3][5])*16+chartoint(syntaxlist[3][6]);
            //imm16_low=chartoint(syntaxlist[3][7])*4096+chartoint(syntaxlist[3][8])*256+chartoint(syntaxlist[3][9])*16+chartoint(syntaxlist[3][10]);
            //构造第一个机器指令 MOVW r0,0XE020
            //1111 0011 0000 1110(E) 0000(r0) 0000 0010 0000 (0x020) 
            *p=0b11110011;
            *(p+1)=0x0E;
            *(p+2)=0x0;
            *(p+3)=0x20;
            //构造第二个机器指令 MOVW r0,0X0280
            *(p+4)=0b11110011;
            *(p+5)=0x00;
            *(p+6)=0x12;
            *(p+7)=0x80;
            //构造第三个机器指令 LSL r0,r0,#0F 
            //1111 0001 1010 1111 0011 0000 1100 0000
            *(p+8)=0b11110001;
            *(p+9)=0b10101111;
            *(p+10)=0b00110000;
            *(p+11)=0b11000000;
            //构造第四个指令 ORR r0,r0,r1    合成32位的数
            //1111 0001 1000 0000(rn=r0) 0000(rd=r0) 0000 0000 0001(rm=r1)
            *(p+8)=0b11110001;
            *(p+9)=0b10000000;
            *(p+10)=0b00000000;
            *(p+11)=0b00000001;
        }
    }
}
　
short chartoint(char conchar)
{
	short result;
	if(57>=int(conchar)>=48)
		result=short(conchar)-48;
	else if(70>=int(conchar)>=65)
		result=short(conchar)-55;
	return result;
}