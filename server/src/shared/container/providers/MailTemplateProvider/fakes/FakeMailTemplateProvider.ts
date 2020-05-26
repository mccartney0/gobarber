import IMailTemplateProvider from '../models/IMailTemplateProdiver';

class FakeMailTemplateProvider implements IMailTemplateProvider {
	public async parse(): Promise<string> {
		return 'Mail content';
	}
}

export default FakeMailTemplateProvider;
