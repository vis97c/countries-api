<template>
   <div class="box --bdr-dashed --bgColor-none --width-100 --size-lg">
      <code class="txt --maxWidth-none --txtColor-secondary --p-30">
         <div class="txt --gap-none">
            <p>
               <span class="--txtWeight-bold">
                  <span class="--txtColor">interface</span> <span id="type-city">City</span>
               </span>
               {
            </p>
            <div class="--pLeft">
               <p class="--txtWrap">
                  name: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  state?: <a class="link --txtStyle" href="#type-state">State</a>;
                  <span class="--txtColor-secondary4"># With "state" querie</span>
               </p>
               <p class="--txtWrap">
                  country?: <a class="link --txtStyle" href="#type-state">Country</a>;
                  <span class="--txtColor-secondary4"># With "country" querie</span>
               </p>
            </div>
            <p>}</p>
         </div>
         <div class="txt --gap-none">
            <p>
               <span class="--txtWeight-bold">
                  <span class="--txtColor">interface</span> <span id="type-state">State</span>
               </span>
               {
            </p>
            <div class="--pLeft">
               <p class="--txtWrap">
                  name: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  code: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  latitude: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  longitude: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  cities?: <a class="link --txtStyle" href="#type-state">City</a> [];
                  <span class="--txtColor-secondary4"># With "cities" querie</span>
               </p>
               <p class="--txtWrap">
                  country?: <a class="link --txtStyle" href="#type-state">Country</a>;
                  <span class="--txtColor-secondary4"># With "country" querie</span>
               </p>
            </div>
            <p>}</p>
         </div>
         <div class="txt --gap-none">
            <p>
               <span class="--txtWeight-bold">
                  <span class="--txtColor">interface</span> <span id="type-country">Country</span>
               </span>
               {
            </p>
            <div class="--pLeft">
               <p class="--txtWrap">
                  name: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  code: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  indicative: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  currency: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  emoji: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  latitude: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  longitude: <span class="--txtColor-primary --txtStyle">string</span>;
               </p>
               <p class="--txtWrap">
                  states?: <a class="link --txtStyle" href="#type-state">State</a> [];
                  <span class="--txtColor-secondary4"># With "states" querie</span>
               </p>
            </div>
            <p>}</p>
         </div>
      </code>
   </div>
</template>
