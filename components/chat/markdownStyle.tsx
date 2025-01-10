
export const markdownStyles = {
    /** Texte de base (body) */
    body: {
      color: '#d4d4d4',
      fontSize: 16,
      lineHeight: 24,
    },
  
    /** Titres (heading1..6) */
    heading1: {
      color: '#d4d4d4',
      fontSize: 32,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading2: {
      color: '#d4d4d4',
      fontSize: 28,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading3: {
      color: '#d4d4d4',
      fontSize: 24,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading4: {
      color: '#d4d4d4',
      fontSize: 20,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading5: {
      color: '#d4d4d4',
      fontSize: 18,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading6: {
      color: '#d4d4d4',
      fontSize: 16,
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
    },
  
    /** Ligne horizontale <hr /> */
    hr: {
      borderBottomColor: '#444444',
      borderBottomWidth: 1,
      marginVertical: 16,
    },
  
    /** Texte en gras <strong> / **texte** */
    strong: {
      fontWeight: 'bold',
      color: '#d4d4d4',
    },
  
    /** Texte en italique <em> / *texte* */
    em: {
      fontStyle: 'italic',
      color: '#d4d4d4',
    },
  
    /** Texte barré <s> / ~~texte~~ */
    s: {
      textDecorationLine: 'line-through',
      color: '#d4d4d4',
    },
  
    /** Bloc de citation <blockquote> */
    blockquote: {
      borderLeftColor: '#6a9955',
      borderLeftWidth: 4,
      paddingLeft: 12,
      marginVertical: 8,
    },
  
    /** Liste à puces <ul> */
    bullet_list: {
      marginVertical: 8,
    },
  
    /** Liste ordonnée <ol> */
    ordered_list: {
      marginVertical: 8,
    },
  
    /** Élément de liste <li> */
    list_item: {
      marginVertical: 4,
    },
    /** Pseudo-classes de list_item */
    bullet_list_icon: {
      color: '#c586c0', // Couleur du symbole •
    },
    bullet_list_content: {
      color: '#d4d4d4',
    },
    ordered_list_icon: {
      color: '#fff',
      fontWeight : 'bold',
      fontSize : 17 ,
    },
    ordered_list_content: {
      color: '#d4d4d4',
    },
  
    /** Code inline `texte` */
    code_inline: {
      backgroundColor: '#222222',
  
      color: '#ababab',
      fontWeight: 'bold' ,
      borderRaduis : 10 , 
      
      fontFamily: "Consolas, 'Courier New', monospace",
    },
  
    /** Bloc de code (non "fence") */
    code_block: {
      backgroundColor: '#1e1e1e',
      borderRadius: 6,
      color: '#ce9178',
      fontFamily: "Consolas, 'Courier New', monospace",
      marginVertical: 8,
      padding: 8,
    },
  
    /** Bloc de code "fence" (```js ... ```) */
    fence: {
      backgroundColor: '#1e1e1e',
      borderRadius: 6,
      color: '#ce9178',
      fontFamily: "Consolas, 'Courier New', monospace",
      marginVertical: 8,
      padding: 8,
    },
  
    /** Tables */
    table: {
      borderWidth: 1,
      borderColor: '#444444',
      marginVertical: 8,
    },
    thead: {
      backgroundColor: '#2d2d2d',
    },
    tbody: {},
    th: {
      color: '#d4d4d4',
      borderWidth: 1,
      borderColor: '#444444',
      padding: 8,
      fontWeight: 'bold',
    },
    tr: {},
    td: {
      color: '#d4d4d4',
      borderWidth: 1,
      borderColor: '#444444',
      padding: 8,
    },
  
    /** Liens <a> */
    link: {
      color: '#3794ff',
      textDecorationLine: 'underline',
    },
  
    /** Lien de bloc <blocklink> */
    blocklink: {
      color: '#3794ff',
      textDecorationLine: 'underline',
    },
  
    /** Images <img> */
    image: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
      marginVertical: 8,
    },
  
    /** Texte brut <text> */
    text: {
      color: '#d4d4d4',
    },
  
    /** Groupe de texte <textgroup> */
    textgroup: {
      color: '#d4d4d4',
    },
  
    /** Paragraphe <p> */
    paragraph: {
      marginVertical: 8,
      color: '#d4d4d4',
    },
  
    /** Saut de ligne dur <br /> */
    hardbreak: {
      width: '100%',
      height: 0,
    },
  
    /** Saut de ligne doux */
    softbreak: {},
  
    /** Balise <pre> (souvent similaire à code_block/fence) */
    pre: {
      backgroundColor: '#1e1e1e',
      padding: 8,
      borderRadius: 6,
    },
  
    /** Inline container */
    inline: {
      color: '#d4d4d4',
    },
  
    /** Span */
    span: {
      color: '#d4d4d4',
    }
  }