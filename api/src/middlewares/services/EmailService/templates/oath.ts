const template = `<ul>
    {{#each questions}}
        <li>{{this.title}}: {{this.answer}}</li>
    {{/each}}
</ul>
`;

export default template;
