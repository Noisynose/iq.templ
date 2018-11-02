/*******************************************************************************
 * Initialiser la variable de namespace iq.templ
 ******************************************************************************/
var iq = iq||{};
iq.templ = {};

(function(templ, iq) {

   const c_typec = 'c';
   const c_typev = 'v';

   class CompressedWords {
      constructor (words, reducedwords) {
         this._words = words;
         this._reducedwords = reducedwords;
      }
      get words()       {   return this._words;   }
      get reducedwords()    {   return this._reducedwords; }
   };

   //Valide et attribut un type pour chaque lettre
   function _typeword(word) {

      const vowels = "aeiouy";
      const consonants = "qwrtpsdfghjklzxcvbnm";

      function __typeletter(letter) {

         let v_reslt;

         if (vowels.search(letter.toLowerCase()) >= 0) {
            v_reslt = c_typev;
         };

         if (consonants.search(letter.toLowerCase()) >= 0) {
            v_reslt = c_typec;
         };

         return v_reslt;
      };

      let typedword = [];

      //Pour chaque lettre dans un mot, augmenter la lettre de son type (sous forme d'un tableau)
      for (i in word) {
         typedword.push([word[i], __typeletter(word[i])]);
      }

      return typedword;
   };

   //Determine les groupes selon les types de lettre
   function _groupword(typeword) {
      let group = [];
      let numgroup = 0;
      let lasttype;

      for (i in typeword) {
         let letter = typeword[i][0];
         let typeletter = typeword[i][1];

         if (lasttype != typeletter)
            numgroup++;

         group.push([letter, typeletter, numgroup]);
         lasttype = typeletter;
      };

      return group;
   };

   //Tronquer les voyelles non nécessaire
   function _reducevowel(groupword) {
      function __filtervowel(letter, numgroupmax) {
         return !(letter[1] == c_typev && letter[2] > numgroupmax);
      };
      //nombre de groupe de voyelles conserve
      //Si la premiere lettre est une voyelle
      keepv = (groupword[0][1]==c_typev) ? 3 : 2;

      let reducedvowel = [];

      //Pourrait etre remplace par un .filter
      for (i in groupword) {
         if (__filtervowel(groupword[i], keepv))
            reducedvowel.push(groupword[i]);
      };

      return reducedvowel;
   };

   //Reduire les duplicats
   function _reduceduplicate(reducevowelword) {
      let noduplicate = [];
      let lastletter;

      for (i in reducevowelword) {
         if (reducevowelword[i][0] != lastletter)
            noduplicate.push(reducevowelword[i]);

         lastletter = reducevowelword[i][0];
      };

      return noduplicate;
   };

   //Reduire le mot
   function _reduceword(word) {
      function __createword(reduceword) {
         let completeword = [];

         for (i in reduceword) {
            completeword.push(reduceword[i][0]);
         };

         return completeword;
      };

      let compressedword = [];

      if (word.length <= 5) {
         for (i in word) {
            compressedword.push(word[i]);
         };
      } else {
         compressedword = __createword(_reducevowel(_reduceduplicate(_groupword(_typeword(word)))).splice(0,5));
      };

      return compressedword;
   };

   templ.reduce = function (words) {
      let reducedwords = [];
      let completewords = [];
      let listwords = words.split(" ");

      for (word in listwords) {
         completewords.push(listwords[word].split(""));
         reducedwords.push(_reduceword(listwords[word]));
      };

      return new CompressedWords(completewords, reducedwords);
   };
})(iq.templ, iq);

//# sourceMappingURL=iq.templ.js.map
