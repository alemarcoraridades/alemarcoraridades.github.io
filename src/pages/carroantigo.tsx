import React from "react";

export default function CarroAntigo() {
  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="w-full bg-[url('https://via.placeholder.com/1600x900')] bg-cover bg-center text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center drop-shadow-xl">
          <img
            src="/ebook_carro_antigo_tablet.png"
            alt="Mockup do ebook"
            className="w-[260px] md:w-[320px] mx-auto mb-6 drop-shadow-xl"
          />
          <h1 className="text-gray-900 text-4xl md:text-6xl font-extrabold leading-tight">
            CARRO ANTIGO<br />
            <span className="text-yellow-400">Realize Seu Sonho Agora</span>
          </h1>
          <p className="mt-4 text-gray-700 text-lg md:text-2xl max-w-3xl mx-auto font-light">
            Aprenda a avaliar carros antigos com segurança, autonomia e confiança —
            mesmo que você seja iniciante.
          </p>
          
          <a
            href="https://pay.kiwify.com.br/ledgJsK"
            className="inline-block mt-10 bg-yellow-400 text-black font-extrabold px-10 py-4 rounded-xl text-xl hover:bg-yellow-300 transition"
          >
            QUERO APRENDER A AVALIAR
          </a>
          <p className="mt-4 text-sm text-gray-700 opacity-90">
            Acesso imediato • Pagamento único • Conteúdo para iniciantes
          </p>
        </div>
      </section>

      {/* BLOCO PRETO INICIAL */}
      <section className="w-full bg-black text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Motores AP<br />
            <span className="text-yellow-400">Conservação e Manutenção Descomplicada</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Aprenda a cuidar do seu motor AP com instruções simples, detalhadas e acessíveis até para iniciantes.
            O guia definitivo para quem quer economizar, preservar o carro e evitar dores de cabeça.
          </p>

          {/* Vídeo demonstrativo do ebook */}
          <div className="mt-6 flex justify-center">
            <video
              className="w-[240px] h-auto rounded-2xl shadow-lg border border-black/10"
              src="/ebook_carro_antigo.MOV"
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={(e) => {
               e.currentTarget.playbackRate = 1.5;
              }}
            />
          </div>

          <a
            href="https://pay.kiwify.com.br/ledgJsK"
            className="inline-block mt-8 bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition"
          >
            Quero Garantir Meu Ebook
          </a>
        </div>
      </section>

      {/* O QUE VAI APRENDER */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            O Que Você Vai Aprender
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              ["🔍  Encontrar bons anúncios", "Como identificar anúncios confiáveis e evitar ciladas comuns."],
              ["🛠️  Avalar o Carro na prática", "Parte externa, interior, mecânica, cofre do motor e pontos de desgaste."],
              ["🛣️  O que observar no Test Drive", "Suspensão, câmbio, desempenho, freios e ruídos suspeitos."],
              ["📄  Negociação e Documentação", "Como negociar, pagar com segurança e conferir toda documentação."]
            ].map(([title, desc], i) => (
              <div key={i} className="border p-6 rounded-2xl shadow bg-white">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Quem Já Comprou, Recomenda</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
             [
             "“Eu sempre tive medo de comprar meu primeiro carro antigo. O ebook me abriu os olhos para detalhes que eu nunca teria percebido sozinho.”",
             "Rodrigo R."
             ],
             [
             "“Depois de ler o guia, consegui avaliar dois carros sozinho e fechei negócio com total segurança. Evitei uma cilada que teria me custado caro.”",
             "Alex S."
             ],
             [
             "“O capítulo sobre negociação vale ouro! Só com essas dicas consegui baixar R$ 2.500 no preço do carro que eu queria.”",
             "Renato M."
             ],
             [
             "“Conteúdo muito direto e fácil de entender. Agora sei exatamente o que olhar quando vou ver um antigo — e parei de depender de terceiros.”",
             "Vitor A."
             ]
            ].map(([text, name], i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow">
                <p className="italic">{text}</p>
                <p className="mt-4 font-bold">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="py-20 px-4 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold">Oferta Especial de Lançamento</h2>

          <p className="mt-6 text-lg opacity-90">
            Baixe agora o ebook completo por um valor promocional por tempo limitado.
          </p>

            {/* Imagem ilustrativa do Gol GL */}
          <div className="mt-10 flex justify-center">
            <img
              src="/Gol_gl_94.jpg"
              alt="Gol GL 94"
              className="w-[360px] md:w-[420px] rounded-2xl shadow-xl border border-black/10"
            />
          </div>


          <div className="bg-white text-black rounded-2xl p-8 mt-10 shadow-xl">
            <h3 className="text-3xl font-bold mb-2">R$ 77,00</h3>
            <p className="text-gray-700 mb-6">Acesso imediato — pagamento único</p>

            <a
              href="https://pay.kiwify.com.br/ledgJsK"
              className="inline-block bg-yellow-400 font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-300 transition"
            >
              Comprar Agora
            </a>
          </div>
        </div>
      </section>

      {/* 5 SINAIS */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-16">
            5 Sinais de Que Você Pode Estar <span className="text-red-600">Caindo em Ciladas</span> ao Comprar um Carro Antigo
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            ["1. Preço Bom Demais", "Ofertas muito abaixo da média geralmente escondem problemas sérios."],
            ["2. Pintura Perfeita", "Carro recém pintado pode estar mascarando reparos profundos."],
            ["3. Quilometragem Baixa", "Sem histórico? Pode ter sido adulterada."],
            ["4. Documentação Confusa", "Erro na numeração, bloqueios e multas escondidas são comuns."],
            ["5. Vendedor Apressado", "Pressão para fechar rápido sempre é um alerta."]

          ].map(([title, desc], i) => (
            <div
              key={i}
              className={`p-8 bg-gray-50 rounded-2xl shadow-lg border 
              ${i === 3 ? "md:col-span-2 md:mx-auto" : ""}
              `}
            >

              <h3 className="text-xl font-bold mb-3 text-red-600">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MINI-OFERTA */}
      <section className="py-20 px-4 bg-yellow-400 text-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Você pode evitar tudo isso — de forma simples
          </h2>

          <p className="mt-6 text-lg max-w-3xl mx-auto">
            Com o método correto, você identifica problemas, negocia melhor e compra o carro certo sem prejuízos.
          </p>

          {/* Imagem ilustrativa do Motor AP */}
          <div className="mt-10 flex justify-center">
            <img
              src="/motor_ap1.jpg"   
              alt="Motor AP 1"
              className="w-[360px] md:w-[420px] rounded-2xl shadow-xl border border-black/10"
            />
          </div>


          <a
            href="https://pay.kiwify.com.br/ledgJsK"
            className="inline-block mt-8 bg-black text-white font-bold px-10 py-4 rounded-xl text-xl hover:bg-gray-800 transition"
          >
            QUERO APRENDER A AVALIAR
          </a>
        </div>
      </section>

      {/* PROBLEMA → CONSEQUÊNCIA → SOLUÇÃO */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Antes de Comprar um Carro Antigo, Você Precisa Saber Disso
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
             [
               "🔍 Problemas Ocultos",
               "Riscos de ferrugem escondida, funilaria mal feita, motor cansado, documentação irregular e históricos que não aparecem no anúncio."
             ],
             [
               "⚠ Consequências Reais",
               "Uma compra mal avaliada pode gerar prejuízos de milhares de reais, longas dores de cabeça e arrependimento logo após levar o carro para casa."
             ],
             [
               "✔ A Solução",
               "Aprenda a avaliar cada parte do carro, negociar com segurança e evitar armadilhas — mesmo sem experiência técnica."
             ]
            ].map(([title, desc], i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl shadow">
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Este Ebook É Para Você Que…
          </h2>

          {/* Imagem ilustrativa (média) */}
          <div className="flex justify-center mb-12">
          <img
            src="/garagem.jpg"   // substitua pelo nome da imagem
            alt="garagem"
            className="w-[400px] md:w-[492px] rounded-2xl drop-shadow-2xl"
          />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              "✔ É entusiasta e quer comprar seu primeiro carro antigo com segurança.",
              "✔ Já tem um carro antigo mas quer trocar sem cair em ciladas.",
              "✔ Não quer pagar caro para intermediários e quer autonomia.",
              "✔ Quer aprender a avaliar um carro antigo do zero."

            ].map((txt, i) => (
              <div key={i} className="p-6 bg-gray-900 rounded-2xl shadow">
                <p className="text-lg">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA DE VALOR */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12">
            O Que Torna Este Material Diferente?
          </h2>

          <p className="text-lg max-w-3xl mx-auto mb-16">
            Nada de termos complicados ou textos técnicos demais.
            Aqui você aprende com clareza, objetividade e exemplos visuais.
          </p>

          {/* Imagem do ebook sem fundo — tamanho médio/grande */}
          <div className="flex justify-center mb-12">
          <img
            src="/ebook_carro_antigo_tablet_inclinado.png"
            alt="Ebook Carro Antigo"
            className="w-[240px] md:w-[300px] rounded-2xl drop-shadow-2xl"
          />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              ["📘 Explicações detalhadas", "Avaliação externa, interior, mecânica, documentação e pontos críticos explicados de forma simples."],
              ["🔧 Passo a passo direto ao ponto", "Você aprende exatamente o que olhar antes de comprar — sem complicação."],
              ["💰 Economia imediata", "Evite cair em armadilhas e economize milhares identificando problemas antes da compra."],
              ["✔ Conteúdo para iniciantes", "Mesmo quem nunca avaliou um carro consegue entender e aplicar tudo."]
            ].map(([title, desc], i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Garantia Incondicional de 7 Dias</h2>

          <p className="text-lg mb-10">
            Se você achar que o ebook não te ajudou ou não era o que esperava,
            basta enviar uma mensagem e devolvemos 100% do valor. Simples assim.
          </p>

          <p className="text-xl font-extrabold">Risco zero para você.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm opacity-70">
        © 2025 Alemarco Raridades — Todos os direitos reservados.
      </footer>

    </div>
  );
  }


