
import handlebars from "handlebars"
import fs from 'node:fs'

type TemplateVariableProps = {
    [key: string]: string | number
}

export type HandlebarsEmailTemplateProps = {
    file: string
    variables: TemplateVariableProps
}

export class HandlebarsEmailTemplate {
    
    async parse({ file, variables }: HandlebarsEmailTemplateProps) {

        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8'
        })

        const parseTemplate = handlebars.compile(templateFileContent)

        return parseTemplate(variables)

    }

}
