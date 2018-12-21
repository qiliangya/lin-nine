
<div className="wrap">
         <div>time: {time}</div>
         {this.props.[object Object]? <p>some error happend</p> :
  <p className="name">your msg: {msg}</p>}
         
         <p v-show="msg" className="shown">test v-show</p>
         <p v-on:click="clickMethod">test v-on</p>
         <img v-bind:src="imageSrc" />
         <ul className="test-list">
             <li v-for="(value, index) in list" v-bind:key="index" className="list-item">
                 <div>{value}</div>
                 <span>{msg}</span>
             </li>
         </ul>
         <span v-text="text"></span>
         <div v-html="html"></div>
         <to-do v-bind:msg="msg" v-bind:list="list"></to-do>
         {msg}
    </div>