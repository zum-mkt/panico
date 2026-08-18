-- Remove a FAQ que afirma não haver carência. Os planos têm carência.

delete from public.faq
where question = 'Existe carência para usar o plano?';
