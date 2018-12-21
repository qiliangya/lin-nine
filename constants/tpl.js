exports.tpl = `
    <div class="wrap">
         <div>time: {{time}}</div>
         <p v-if="error">some error happend</p>
         <p v-else class="name">your msg: {{msg}}</p>
         <p v-show="msg" class="shown">test v-show</p>
         <p v-on:click="clickMethod">test v-on</p>
         <img v-bind:src="imageSrc" />
         <ul class="test-list">
             <li v-for="(value, index) in list" v-bind:key="index" class="list-item">
                 <div>{{value}}</div>
                 <span>{{msg}}</span>
             </li>
         </ul>
         <span v-text="text"></span>
         <div v-html="html"></div>
         <to-do v-bind:msg="msg" v-bind:list="list"></to-do>
         {{msg}}
    </div>
`