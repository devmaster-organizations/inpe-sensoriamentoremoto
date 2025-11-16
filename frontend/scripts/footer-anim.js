// Controla a visibilidade do footer: oculto inicialmente, aparece ao rolar para perto do fim
// e desaparece ao clicar fora dele. Quando visível, empurra o conteúdo para cima via padding-bottom.
(function(){
	'use strict';

	function selectFooter(){
		// Tenta pelo id usado no componente; se não achar, pega o primeiro footer da página
		return document.querySelector('footer#rodape') || document.querySelector('footer');
	}

	function initOnce(){
		if (window.__footerBehaviorInitialized) return true;
		const footer = selectFooter();
		if (!footer) return false;

		const state = { visible: false };

		function setFooterHeightVar(){
			const h = footer.offsetHeight || 0;
			document.documentElement.style.setProperty('--footer-height', h + 'px');
		}

		function show(){
			if (state.visible) return;
			state.visible = true;
			setFooterHeightVar();
			footer.classList.add('is-visible');
			document.body.classList.add('has-footer-visible');
		}

		function hide(){
			if (!state.visible) return;
			state.visible = false;
			footer.classList.remove('is-visible');
			document.body.classList.remove('has-footer-visible');
			// opcional: limpar variável
			// document.documentElement.style.setProperty('--footer-height', '0px');
		}

		function onScroll(){
			const scrollY = window.scrollY || window.pageYOffset;
			const winH = window.innerHeight || document.documentElement.clientHeight;
			const docH = Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight
			);
			// Considera "próximo ao fim" quando faltam ~120px para o fim
			const nearBottom = scrollY + winH >= docH - 120;
			if (nearBottom) show();
		}

		function onResize(){
			if (state.visible) setFooterHeightVar();
		}

		function onDocClick(e){
			// Esconde quando clicar em qualquer lugar fora do footer
			if (!footer.contains(e.target)) hide();
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		document.addEventListener('click', onDocClick);

		// Garante invisível no início
		hide();

		// Expor API mínima (útil se o router chamar após includes)
		window.__footerBehaviorInitialized = true;
		window.__footerBehavior = { show, hide, refresh: setFooterHeightVar };
		return true;
	}

	// Tenta inicializar imediatamente; se não houver footer ainda, observa o DOM
	if (!initOnce()) {
		const obs = new MutationObserver(() => {
			if (initOnce()) obs.disconnect();
		});
		obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
		// Fallback após um pequeno atraso
		setTimeout(initOnce, 1200);
	}

	// Função pública para o router chamar após includes
	window.initFooterBehavior = function(){
		if (!window.__footerBehaviorInitialized) {
			initOnce();
		} else if (window.__footerBehavior && document.body.classList.contains('has-footer-visible')) {
			// Recalcula altura se já estiver visível
			try { window.__footerBehavior.refresh(); } catch (e) {}
		}
	};
})();

