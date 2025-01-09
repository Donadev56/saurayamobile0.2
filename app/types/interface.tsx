export interface MessageInterface { 
    role : 'assistant' | 'user' | 'system' ,
    content : string
    images? : [string]
}