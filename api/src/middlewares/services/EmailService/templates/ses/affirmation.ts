const template = `

<ul>
    {{#each questions}}
        <li>{{this.title}}: {{this.answer}}</li>
    {{/each}}
</ul>

{{#if payment}}
    Payment details: <br/>
    <a href="{{payment.url}}">View payment details or refund {{ payment.id }} ({{payment.status}})</a> <br/>
    <a href="{{payment.allTransactionsByCountry.url}}"> View all transactions for {{payment.allTransactionsByCountry.country}}</a>
{{/if}}
`;
export default template;
