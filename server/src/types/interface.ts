import { ChatResponse } from "ollama"

export interface MessageInterface { 
    role : 'assistant' | 'user' | 'system' ,
    content : string
    images? : [string]
}

export interface OllamaChatRequest {
    model : string,
    messages : MessageInterface [],
    stream? : boolean
}

export interface PartialResponse {
    isFirst : boolean ,
    response : ChatResponse
}