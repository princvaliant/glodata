import '../../model/domain/fileMeta';

export default {
    getReplaceExisting: function (stepTag) {
        let fm = FileMetas.findOne({stepTag: stepTag});
        if (fm) {
            return fm.replaceExisting === true;
        }
        return false;
    },
}