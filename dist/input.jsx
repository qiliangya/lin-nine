
<div className="wrap">
         <div>time: {time}</div>
         {this.state.error ? <p>some error happend</p> :
  <p className="name">your msg: {msg}</p>}
         
         <p style={{ display: this.props.msg ? 'block' : 'none' }} className="shown">test v-show</p>
         <p onClick={this.clickMethod}>test v-on</p>
         <img src={this.props.imageSrc} />
         <ul className="test-list">
             {this.props.list.map((value, index) => {return <li key={index}>
                 <div>{value}</div>
                 <span>{msg}</span>
             </li>;})}
         </ul>
         <span>{this.props.text.replace(/<[^>]+>/g, '')}</span>
         <div dangerouslySetInnerHTML={{ __html: this.props.html }}></div>
         <to-do msg={this.props.msg} list={this.props.list}></to-do>
         {msg}
    </div>