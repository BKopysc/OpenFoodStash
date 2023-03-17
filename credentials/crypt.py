# py crypt.py [filename] [mode] [password] [shouldSaveDecrypted]
# mode: 0 - encrypt, 1 - decrypt

import string
import random
import sys
from pathlib import Path

def print_instruction():
    print("\n--- Simple XOR crypt: encrypt/decrypt file with given password ---\n")
    print("py crypt.py [filename] [0 - encrypt / 1 - decrypt] [password] [yes - save decrypted?] \n")
    exit(-1)

if (len(sys.argv) < 4 and len(sys.argv) > 5 or len(sys.argv) == 1):
    print_instruction()

filename = sys.argv[1] # filename
mode = sys.argv[2] # 0 or 1
key = sys.argv[3] # user key
should_save_decrypted = False

if(len(sys.argv) == 5 and sys.argv[4] == 'yes' ):
    should_save_decrypted = True

txt = Path(filename).read_text()
padded_key="" # padded key for text len 
key_ctr=0

for char in txt:
    padded_key+=key[key_ctr]
    key_ctr += 1
    if(key_ctr >= len(key)):
        key_ctr = 0


def str_xor(s1, s2):
    return "".join([chr(ord(c1) ^ ord(c2)) for (c1,c2) in zip(s1,s2)])

def save_encrypted(enc_txt, ex_filename):
    ex_filename = ex_filename.replace("/", "")
    ex_filename = ex_filename.replace("\\", "")
    f_tab =  ex_filename.split('.')
    new_filename = f_tab[len(f_tab)-2] + "_encrypted." + f_tab[len(f_tab)-1]  + ".secure"
    text_file = open(new_filename, "w")
    text_file.write(enc_txt)
    text_file.close()
    return new_filename

def save_decrypted(enc_txt, ex_filename):
    ex_filename = ex_filename.replace("/", "")
    ex_filename = ex_filename.replace("\\", "")
    ex_filename = ex_filename.replace("encrypted", "decrypted")
    f_tab =  ex_filename.split('.')
    new_filename = f_tab[len(f_tab)-3] + "." + f_tab[len(f_tab)-2]
    text_file = open(new_filename, "w")
    text_file.write(enc_txt)
    text_file.close()
    return new_filename


if(mode == '0'):
    enc = str_xor(txt, padded_key)
    fn = save_encrypted(enc, filename)
    print("\nSaved encrypted file: \n" + fn + "\n")

elif(mode == '1'):
    #enc = str_xor(txt, key)
    dec = str_xor(txt, padded_key)
    print("\nDecrypted content: \n\n" + dec + "\n")
    if(should_save_decrypted):
        fn = save_decrypted(dec, filename)
        print("Saved decrypted as: " + fn)
else:
    print_instruction()
