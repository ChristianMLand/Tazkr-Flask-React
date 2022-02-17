CHAR_MAP = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

def convertToBase(num,base):
    digits = []
    while num > 0:
        digits = [num % base] + digits
        num = num // base
    return digits

def convertFromBase(digits,base):
    sum = 0
    while digits:
        sum += digits.pop() * (base ** len(digits))
    return sum

def shortenURL(uid):
    digits = convertToBase(uid,len(CHAR_MAP))
    return ''.join(CHAR_MAP[digit] for digit in digits)

def getOriginalUrl(short):
    digits = []
    for char in short:
        digits = [CHAR_MAP.index(char)] + digits
    return convertFromBase(digits,len(CHAR_MAP))

# TODO use this for the board urls instead of direct ids