-- Substitui o texto da página Sobre nós pela história oficial do Grupo,
-- mantendo as fotos e a galeria já publicadas.

update public.page_sections
set position = 0
where id = 'af60a783-50c2-4a7f-8c71-aaea95b3ccb7';

update public.page_sections
set position = 1,
    content = jsonb_build_object(
      'title', 'A História do Grupo Funerário Paníco',
      'subtitle', 'Uma trajetória construída por gerações',
      'body', $hist$<p>A história do Grupo Funerário Paníco começou em 1978, em Lençóis Paulista, quando Oswaldo Panico, após 18 anos de atuação na indústria cervejeira em Agudos, decidiu retornar à sua cidade natal e iniciar uma nova trajetória profissional.</p>
<p>Foi nesse momento que surgiu a oportunidade de se associar ao empresário José Diegoli, então proprietário da Funerária Diegoli. Dessa parceria nasceu o início da atuação da família Panico no segmento funerário.</p>
<p>Desde os primeiros anos, Oswaldo contou com a participação de seus filhos, Lourival e Angelo José Panico, que passaram a trabalhar na empresa e aprenderam, desde cedo, os valores que se tornariam a base do negócio: respeito, responsabilidade, acolhimento, dedicação e cuidado com as famílias.</p>
<p>Com o crescimento da empresa e a confiança conquistada pela comunidade, o nome Panico passou a ganhar reconhecimento no setor funerário regional. Ao lado de sua esposa, Iracema Mafalda Placca Panico, Oswaldo manteve vivo seu espírito empreendedor e decidiu ampliar os negócios.</p>
<p>Em 1981, o Grupo deu seu primeiro grande passo de expansão com a abertura da filial de Macatuba. Dois anos depois, em 1983, foi inaugurada uma nova unidade, desta vez em Penápolis, consolidando a presença da família Panico em diferentes cidades da região.</p>$hist$
    )
where id = '9cc02aba-072c-4e8f-8730-234c8938cc39';

update public.page_sections
set position = 2
where id = '027ba986-9052-466c-944c-9da1a912588b';

update public.page_sections
set position = 3,
    content = jsonb_build_object(
      'body', $hist$<h2>Uma nova geração à frente dos negócios</h2>
<p>Em 1996, com o falecimento de Oswaldo Panico, seus filhos assumiram novas responsabilidades na condução dos negócios. Angelo José Panico passou a administrar as operações de Lençóis Paulista e Macatuba, enquanto Lourival Panico assumiu a operação de Penápolis.</p>
<p>A partir desse momento, teve início uma nova etapa na história da família. Mantendo os princípios deixados por Oswaldo, Angelo promoveu importantes investimentos e melhorias, modernizando as instalações, renovando a frota, capacitando continuamente os colaboradores e aprimorando os serviços oferecidos às famílias.</p>
<h2>Expansão e novos serviços</h2>
<p>Em 2015, o Grupo deu mais um importante passo com a inauguração do Cemitério Parque Irmãos Panico.</p>
<p>Planejado para oferecer um espaço de descanso digno e tranquilo, o empreendimento ampliou a estrutura de atendimento do Grupo e passou a proporcionar às famílias um ambiente de conforto, serenidade e acolhimento.</p>
<p>Mais do que uma expansão empresarial, o cemitério representou a concretização de uma visão de futuro: oferecer uma estrutura cada vez mais completa, mantendo sempre o respeito e a dignidade como princípios fundamentais.</p>$hist$
    )
where id = '9e1f3653-cbea-48a8-9e30-b30d1a211d32';

update public.page_sections
set position = 4,
    content = jsonb_build_object(
      'body', $hist$<h2>Tradição e inovação</h2>
<p>Em 2022, o Grupo Funerário Paníco inaugurou o Centro Velatório Funerária Paníco de Lençóis Paulista, marcando uma nova fase de modernização da empresa.</p>
<p>Com ambientes planejados, salas climatizadas, reservadas e acolhedoras, o novo espaço foi criado para proporcionar às famílias mais conforto e tranquilidade durante os momentos de despedida.</p>
<p>Nesse mesmo processo de evolução, a terceira geração da família passou a participar diretamente da administração dos negócios. Wilian José Andreotti Panico uniu-se ao seu pai, Angelo, trazendo uma visão contemporânea de gestão e negócios, sem deixar de lado os valores construídos ao longo de décadas.</p>
<p>A chegada da terceira geração representa a continuidade de um legado familiar e, ao mesmo tempo, a renovação necessária para acompanhar as transformações do mercado e as novas necessidades das famílias.</p>
<h2>2026: um novo capítulo em Macatuba</h2>
<p>Em 2026, o Grupo Funerário Paníco voltou às suas raízes de expansão com a inauguração do Centro Velatório Funerária Paníco de Macatuba.</p>
<p>A nova estrutura representa um momento simbólico para a família: foi justamente em Macatuba que, em 1981, teve início a expansão do Grupo para além de Lençóis Paulista.</p>
<p>Quarenta e cinco anos depois, a cidade recebe uma estrutura moderna, preparada para oferecer ainda mais conforto, acolhimento e qualidade às famílias.</p>
<h2>Um legado que continua</h2>
<p>De 1978 até os dias atuais, a história do Grupo Funerário Paníco foi marcada por trabalho, empreendedorismo, investimentos e, principalmente, dedicação às pessoas.</p>
<p>São quase cinco décadas construindo uma trajetória baseada na confiança e no compromisso de oferecer respeito, dignidade, acolhimento e qualidade em momentos que exigem sensibilidade e cuidado.</p>
<p>Oswaldo Panico iniciou esse caminho com coragem e visão empreendedora. Angelo e Lourival deram continuidade ao legado familiar e contribuíram para a consolidação do Grupo. Hoje, a terceira geração, representada por Wilian José Andreotti Panico, participa da construção dos próximos capítulos dessa história.</p>
<p>Mais do que uma empresa, o Grupo Funerário Paníco é um legado familiar que atravessa gerações, preservando seus valores enquanto olha para o futuro.</p>
<blockquote><p>Desde 1978, uma história de família.<br>Uma história de cuidado.<br>Uma história que continua.</p></blockquote>$hist$
    )
where id = '9683b5e3-c4e6-4f83-8ead-7e1fc488ebc1';

update public.page_sections
set position = 5
where id = 'd29e4969-36d4-44dc-9a33-f8eab377917e';

update public.pages
set seo_title = 'A História do Grupo Funerário Paníco',
    seo_description = 'Uma trajetória construída por gerações, desde 1978, com respeito, acolhimento e cuidado com as famílias.'
where slug = 'sobre-nos';
